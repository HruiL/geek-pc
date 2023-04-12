import React, { Component, lazy, Suspense } from "react";
import { RouteComponentProps } from "react-router-dom";
import styles from "./index.module.css";

import { CoverType, PublishArticleParams } from "article";
import Channels from "@shared/channels";
import {
  publishArticle,
  requestModifyArticle,
  uploadImg,
} from "@requests/article";
import { AxiosError, AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { history } from "@src/App";
import Crumbs from "@pages/articlePage/crumbs";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleDetailActions } from "@actions/articleDetailActions";
import { articleDetailCreator } from "@store/creators/articleDetailCreator";
import { ArticleDetailRes } from "@reducers/articleDetail.reducer";
import Loading from "@shared/loading";
const ReactQuill = lazy(() => import("react-quill"));
interface States {
  // 发布文章时的数据
  article: PublishArticleParams;
  // 文件上传
  fileUpload: {
    // 文件上传的进度
    percentage: number;
    // 上传失败的错误信息
    error: string | null;
  };
  // 发布文章请求的状态
  publishArticleStatus: Status;
  // 发布文章请求的失败信息
  publishArticleError: null | string;
}
interface publishPageProps {}
interface StateProps {
  articleDetail: ArticleDetailRes;
}
interface OwnProps {}
interface DispatchProps {
  getArticleDetail(id: string): Promise<ArticleDetailActions.Actions>;
}
type Props = publishPageProps &
  StateProps &
  OwnProps &
  DispatchProps &
  RouteComponentProps<{ id: string }>;
class PublishPage extends Component<Readonly<Props>, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      article: {
        title: "",
        channel_id: undefined,
        content: "",
        cover: {
          type: 0,
          images: [],
        },
      },
      fileUpload: {
        percentage: 0,
        error: null,
      },
      publishArticleStatus: "idle",
      publishArticleError: null,
    };
    this.updateFormState = this.updateFormState.bind(this);
    this.updateChannelId = this.updateChannelId.bind(this);
    this.uploadCover = this.uploadCover.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.getArticleDetail = this.getArticleDetail.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  // 更改组件状态
  updateFormState(
    name: keyof PublishArticleParams,
    value: PublishArticleParams[keyof PublishArticleParams]
  ) {
    this.setState({
      article: {
        ...this.state.article,
        [name]: value,
      },
    });
  }
  // 更改channel_id
  updateChannelId(id: string) {
    this.setState({
      article: {
        ...this.state.article,
        channel_id: id === "请选择文章频道" ? undefined : id,
      },
    });
  }
  // 上传文章封面
  async uploadCover(event: React.ChangeEvent<HTMLInputElement>) {
    // 如果上传的图片超过三张，就别让用户上传了
    if (this.state.article.cover.images.length === 3) {
      return this.setState({
        fileUpload: {
          ...this.state.fileUpload,
          error: "最多只可以传递三张图片",
        },
      });
    }
    // 上传的图片
    const files = event.target.files;
    // 判断文件列表是否不为null
    if (files !== null) {
      // 上传之前 先重置上传进度，将上一次的进度和错误信息清空
      this.setState({ fileUpload: { error: null, percentage: 0 } });
      // 如果不为null 上传图片
      try {
        const response = await uploadImg(files[0], this.onUploadProgress);
        this.setState({
          article: {
            ...this.state.article,
            cover: {
              images: [...this.state.article.cover.images, response.data.url],
              // type 要用到images数组的长度，但是不能获取到新值，因为每次只能传一张，所有+1就相当于是最新值
              type: (this.state.article.cover.images.length + 1) as CoverType,
            },
          },
        });
      } catch (error) {
        this.setState({
          fileUpload: {
            ...this.state.fileUpload,
            error:
              error instanceof AxiosError
                ? error.response?.data?.message
                : (error as Error).message,
          },
        });
      }
    }
  }
  // 更新上传进度
  onUploadProgress(progressEvent: AxiosProgressEvent) {
    // loaded 已上传的大小
    // total 总共的大小
    const { loaded, total } = progressEvent;
    if (typeof total !== "undefined") {
      let percentage = Math.ceil((loaded * 100) / total);
      this.setState({
        fileUpload: {
          ...this.state.fileUpload,
          percentage,
        },
      });
    }
  }
  // 发布/修改文章
  async submitHandler(draft: boolean) {
    // 将发布文章的状态修改为pending
    this.setState({
      ...this.state,
      publishArticleStatus: "pending",
      publishArticleError: null,
    });
    // 获取路径参数的文章id
    const aid = this.props.match.params.id;
    try {
      // 判断文章id是否存在
      if (typeof aid !== "undefined") {
        // 说明是修改文章
        await requestModifyArticle(aid, draft, this.state.article);
      } else {
        // 说明是发布文章
        await publishArticle(draft, this.state.article);
      }
      // 设置组件的状态为success
      this.setState({
        ...this.state,
        publishArticleError: null,
        publishArticleStatus: "success",
      });
      // 发布成功消息提示
      toast.success(`${aid ? "编辑" : "发布"}成功`, { position: "top-center" });
      // 发布成功跳转到文章页
      history.push("/admin/article");
    } catch (error) {
      this.setState(
        {
          ...this.state,
          publishArticleStatus: "error",
          publishArticleError:
            error instanceof AxiosError
              ? error.response?.data?.message
              : (error as Error).message,
        },
        () => {
          toast.error(
            `文章${aid ? "编辑" : "发布"}失败：${
              this.state.publishArticleError
            }`,
            {
              position: "top-center",
            }
          );
        }
      );
    }
  }
  // 页面挂载完成之后获取文章详情
  async componentDidMount() {
    await this.getArticleDetail();
  }
  // 获取文章详情
  async getArticleDetail() {
    const aid = this.props.match.params.id;
    if (typeof aid !== "undefined") {
      await this.props.getArticleDetail(aid);
      const articleDetail = this.props.articleDetail.result;
      this.setState({
        ...this.state,
        article: {
          title: articleDetail.title!,
          content: articleDetail.content!,
          cover: articleDetail.cover!,
          channel_id: articleDetail.channel_id,
        },
      });
    }
  }
  // 渲染form表单数据
  renderForm() {
    return (
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">
              标题 <span className="has-text-danger">*</span>
            </label>
          </div>
          <div className="field-body">
            <input
              className="input"
              type="text"
              placeholder="请输入文章标题(必填)"
              value={this.state.article.title}
              onChange={(event) =>
                this.updateFormState("title", event.target.value)
              }
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">
              频道 <span className="has-text-danger">*</span>
            </label>
          </div>
          <div className="field-body">
            <Channels
              defaultChannelId={this.state.article.channel_id}
              updateChannelId={this.updateChannelId}
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label">封面</label>
          </div>
          <div className="field-body">
            {this.state.article.cover.images.map((img) => (
              <figure className="image is-128x128 mr-2" key={img}>
                <img src={img} alt="" />
              </figure>
            ))}
            <div className="file is-medium is-boxed">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  onChange={this.uploadCover}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">上传图片</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label"></div>
          <div className="field-body" style={{ flexWrap: "wrap" }}>
            {this.state.fileUpload.percentage > 0 && (
              <progress
                className="progress is-danger is-small"
                value={this.state.fileUpload.percentage}
                max="100"
              >
                {this.state.fileUpload.percentage}%
              </progress>
            )}
            {this.state.fileUpload.error && (
              <p className="has-text-danger">
                文件上传失败, 失败原因: {this.state.fileUpload.error}
              </p>
            )}
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">
              内容 <span className="has-text-danger">*</span>
            </label>
          </div>
          <div className="field-body">
            <Suspense fallback={<Loading />}>
              <ReactQuill
                theme="snow"
                value={this.state.article.content}
                onChange={(value) => this.updateFormState("content", value)}
              />
            </Suspense>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label"></div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <button
                  className="button is-primary mr-3"
                  onClick={() => this.submitHandler(false)}
                >
                  {this.props.match.params.id ? "编辑文章" : "发布文章"}
                </button>
                <button
                  className="button is-info"
                  onClick={() => this.submitHandler(true)}
                >
                  存入草稿
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
  render() {
    return (
      <div className={`has-background-white ${styles.publishPage}`}>
        <Crumbs
          children={this.props.match.params.id ? "编辑文章" : "发布文章"}
          url={
            this.props.match.params.id ? "/admin/publish" : this.props.match.url
          }
        />
        {this.renderForm()}
      </div>
    );
  }
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  articleDetail: state.articleDetailReducer.articleDetail,
});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  // 获取文章详情
  getArticleDetail: (id) => dispatch(articleDetailCreator.articleDetail(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PublishPage);
