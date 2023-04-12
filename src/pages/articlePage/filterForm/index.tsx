import React, { Component, lazy, Suspense } from "react";
import styles from "./index.module.css";
import Channels from "@shared/channels";
import { ArticleStatus, requestArticleParams } from "article";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { AppThunkDispatch } from "@src/store";
import { ArticleActions } from "@actions/articleActions";
import { ArticleCreator } from "@store/creators/articleCreator";
import DatePicker from "react-datepicker";
interface filterFormProps {}
interface DispatchProps {
  filterArticles(
    reqParams: Partial<requestArticleParams>
  ): Promise<ArticleActions.Actions>;
}
interface OwnProps {
  articleReqParams: requestArticleParams;
  updateReqParams: (reqParams: Partial<requestArticleParams>) => void;
}
type Props = filterFormProps & DispatchProps & OwnProps;
class FilterForm extends Component<Readonly<Props>> {
  constructor(props: Props) {
    super(props);
    this.updateArticleStatus = this.updateArticleStatus.bind(this);
    this.updateChannelId = this.updateChannelId.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
    this.filterHandler = this.filterHandler.bind(this);
  }
  // 更改文章状态
  updateArticleStatus(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateReqParams({
      status:
        parseInt(event.currentTarget.value) === -1
          ? undefined
          : (parseInt(event.currentTarget.value) as ArticleStatus),
    });
  }
  // 更新频道id
  updateChannelId(id: string) {
    // 如果选择的是 选择频道列表，将channel_id设置为undefined，获取全部频道的文章列表
    this.props.updateReqParams({
      channel_id: id === "请选择文章频道" ? undefined : id,
    });
  }
  // 当日期发生变化时执行
  onDateChanged(dates: (Date | null)[]) {
    // 更改筛选条件的其实时间和结束时间
    this.props.updateReqParams({
      begin_pubdate: dates[0],
      end_pubdate: dates[1],
    });
  }
  // 点击筛选
  async filterHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await this.props.filterArticles(this.props.articleReqParams);
  }
  render() {
    const articleReqParams = this.props.articleReqParams;
    return (
      <form className={styles.filterForm} onSubmit={this.filterHandler}>
        <div className="field is-horizontal mb-5">
          <div className="field-label">
            <label className="label">状态：</label>
          </div>
          <div className="field-body">
            <label className="radio mr-3">
              <input
                type="radio"
                name="status"
                className="mr-1"
                value={-1}
                onChange={this.updateArticleStatus}
                checked={articleReqParams.status === undefined}
              />
              全部
            </label>
            <label className="radio mr-3">
              <input
                type="radio"
                name="status"
                className="mr-1"
                value={0}
                onChange={this.updateArticleStatus}
                checked={articleReqParams.status === 0}
              />
              草稿
            </label>
            <label className="radio mr-3">
              <input
                type="radio"
                name="status"
                className="mr-1"
                value={1}
                onChange={this.updateArticleStatus}
                checked={articleReqParams.status === 1}
              />
              待审核
            </label>
            <label className="radio mr-3">
              <input
                type="radio"
                name="status"
                className="mr-1"
                value={2}
                onChange={this.updateArticleStatus}
                checked={articleReqParams.status === 2}
              />
              审核通过
            </label>
            <label className="radio mr-3">
              <input
                type="radio"
                name="status"
                className="mr-1"
                value={3}
                onChange={this.updateArticleStatus}
                checked={articleReqParams.status === 3}
              />
              审核失败
            </label>
          </div>
        </div>
        <div className="field is-horizontal mb-5">
          <div className="field-label is-normal">
            <label className="label">频道：</label>
          </div>
          <div className="field-body">
            <Channels
              defaultChannelId={articleReqParams.channel_id}
              updateChannelId={this.updateChannelId}
            />
          </div>
        </div>
        <div className="field is-horizontal mb-5">
          <div className="field-label is-normal">
            <label className="label">日期：</label>
          </div>
          <div className="field-body">
            <DatePicker
              className="input"
              onChange={this.onDateChanged}
              startDate={articleReqParams.begin_pubdate}
              endDate={articleReqParams.end_pubdate}
              placeholderText={"请选择日期"}
              dateFormat={"yyyy-MM-dd"}
              selectsRange
              isClearable
            ></DatePicker>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <button className="button is-link">筛选</button>
          </div>
          <div className="field-body"></div>
        </div>
      </form>
    );
  }
}
const mapStateToProps = () => ({});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  filterArticles: (reqParams: Partial<requestArticleParams>) =>
    dispatch(ArticleCreator.requestArticles(reqParams)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterForm);
