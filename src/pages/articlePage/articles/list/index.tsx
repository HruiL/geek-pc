import React, { Component } from "react";
import styles from "./index.module.css";
import Item from "@pages/articlePage/articles/item";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleCreator } from "@store/creators/articleCreator";
import { ArticleRes } from "@reducers/article.reducer";
import { ArticleActions } from "@actions/articleActions";
import { requestArticleParams } from "article";
import Confirm from "@shared/confirm";
import { deleteArticle } from "@requests/article";
import { AxiosError } from "axios";
interface StateProps {
  articles: ArticleRes;
}
interface States {
  isOpen: boolean;
  deleteArticleStatus: Status;
  deleteArticleError: null | string;
  id: string;
}
interface OwnProps {
  reqParams: requestArticleParams;
}
interface DispatchProps {
  requestArticles: (
    reqParams?: Partial<requestArticleParams>
  ) => Promise<ArticleActions.Actions>;
}
type Props = StateProps & OwnProps & DispatchProps;
class List extends Component<Readonly<Props>, States> {
  constructor(props: Props) {
    super(props);
    // 当前组件的状态
    this.state = {
      // 控制删除弹框的是否显示
      isOpen: false,
      // 删除文章的状态
      deleteArticleStatus: "idle",
      // 删除文章的错误信息
      deleteArticleError: null,
      // 要删除的那篇文章的id
      id: "",
    };
    this.renderTableBody = this.renderTableBody.bind(this);
    this.deleteConfirmOpen = this.deleteConfirmOpen.bind(this);
    this.deleteArticleHandler = this.deleteArticleHandler.bind(this);
  }
  async componentDidMount() {
    // 页面挂载完成 请求文章列表
    await this.props.requestArticles();
  }
  // 点击删除按钮，将弹框显示出来，将该方法传递给子组件，并接受子组件传递上来的文章id
  deleteConfirmOpen(id: string) {
    this.setState({ isOpen: true, id });
  }
  // 点击删除确认框的确认按钮时触发的事件
  async deleteArticleHandler() {
    // 更改组件状态为等待态
    this.setState({ deleteArticleError: null, deleteArticleStatus: "pending" });
    try {
      // 发送请求，删除文章
      await deleteArticle(this.state.id);
      // 重新获取文章列表
      await this.props.requestArticles(this.props.reqParams);
      // 更改组件状态为成功态
      this.setState({
        deleteArticleStatus: "success",
        deleteArticleError: null,
      });
    } catch (error) {
      // 更改组件状态为失败态，并保存错误信息
      this.setState({
        deleteArticleError:
          error instanceof AxiosError
            ? error.response?.data?.message
            : (error as Error).message,
        deleteArticleStatus: "error",
      });
    }
  }
  // 渲染表格体
  renderTableBody() {
    const { articles } = this.props;
    if (articles.status === "idle") {
      return;
    } else if (articles.status === "pending") {
      return (
        <tr>
          <td colSpan={8}>
            <div className="is-flex is-justify-content-center is-size-4 p-6">
              <i className="fas fa-spinner fa-pulse"></i>
            </div>
          </td>
        </tr>
      );
    } else if (articles.status === "error") {
      return (
        <tr>
          <td>
            <div className="is-flex is-justify-content-center is-size-4 p-6">
              {articles.error}
            </div>
          </td>
        </tr>
      );
    } else {
      return articles.result.results?.map((item) => (
        <Item
          key={item.id}
          article={item}
          deleteConfirmOpen={this.deleteConfirmOpen}
        />
      ));
    }
  }
  render() {
    return (
      <div className={styles.articles}>
        <div className={`p-5 is-size-5 has-text-weight-medium ${styles.total}`}>
          根据筛选条件共查询到 {this.props.articles.result.total_count} 条结果：
        </div>
        <div className="pl-5 pr-5 mt-5">
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>封面</th>
                <th>标题</th>
                <th>状态</th>
                <th>发布时间</th>
                <th>阅读数</th>
                <th>评论数</th>
                <th>点赞数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </table>
          <Confirm
            isOpen={this.state.isOpen}
            close={() => {
              this.setState({ isOpen: false });
            }}
            content={"您确定要删除这篇文章吗"}
            onSureButtonClickHandler={this.deleteArticleHandler}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  // 文章列表相关状态
  articles: state.articleReducer.articles,
});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  // 请求文章列表
  requestArticles: (reqParams) =>
    dispatch(ArticleCreator.requestArticles(reqParams)),
});
export default connect(mapStateToProps, mapDispatchToProps)(List);
