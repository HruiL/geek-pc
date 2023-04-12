import React, { Component } from "react";
import Crumbs from "@pages/articlePage/crumbs";
import FilterForm from "@pages/articlePage/filterForm";
import Pagination from "@pages/articlePage/pagination";
import List from "@pages/articlePage/articles/list";
import { requestArticleParams } from "article";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { ArticleRes } from "@reducers/article.reducer";
import { AppState, AppThunkDispatch } from "@src/store";
import { ArticleActions } from "@actions/articleActions";
import { ArticleCreator } from "@store/creators/articleCreator";

interface States {
  articleReqParams: requestArticleParams;
}
interface StateProps {
  // 文章相关的状态
  articles: ArticleRes;
}
interface DispatchProps {
  // 当一页显示多少页码发生变化时要重新发送请求文章列表的请求，更新文章列表
  updateArticle(
    reqParams: Partial<requestArticleParams>
  ): Promise<ArticleActions.Actions>;
}
interface OwnProps {}
type Props = StateProps & DispatchProps & OwnProps;
class ArticlePage extends Component<Readonly<Props>, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      articleReqParams: {
        // undefined表示全部
        status: undefined,
        // 不传channel_id默认获取所有频道
        channel_id: undefined,
        // 当前页码
        page: 1,
        // 一页显示多少数据
        per_page: 10,
        // 开始时间
        begin_pubdate: null,
        // 结束时间
        end_pubdate: null,
      },
    };
    this.updateReqParams = this.updateReqParams.bind(this);
  }
  // 更新筛选条件
  updateReqParams(reqParams: Partial<requestArticleParams>) {
    this.setState({
      articleReqParams: { ...this.state.articleReqParams, ...reqParams },
    });
  }
  // 当状态发生变化时（当前页码和一页显示多少数据发生变化时）发送获取文章列表的请求，更新文章列表数据
  async componentDidUpdate(
    prevProps: Readonly<Readonly<Props>>,
    prevState: Readonly<States>
  ) {
    if (
      prevState.articleReqParams.per_page !==
        this.state.articleReqParams.per_page ||
      prevState.articleReqParams.page !== this.state.articleReqParams.page
    ) {
      await this.props.updateArticle(this.state.articleReqParams);
    }
  }

  render() {
    const { page, per_page } = this.state.articleReqParams;
    return (
      <>
        <div className="has-background-white mb-5">
          <Crumbs children={"内容管理"} url={"/admin/article"} />
          <FilterForm
            articleReqParams={this.state.articleReqParams}
            updateReqParams={this.updateReqParams}
          />
        </div>
        <div className="has-background-white">
          <List reqParams={this.state.articleReqParams} />
          <Pagination
            updateReqParams={this.updateReqParams}
            page={page}
            per_page={per_page}
            maxShowPageCount={5}
            total={this.props.articles.result.total_count!}
          />
        </div>
      </>
    );
  }
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  articles: state.articleReducer.articles,
});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  updateArticle: (reqParams: Partial<requestArticleParams>) =>
    dispatch(ArticleCreator.requestArticles(reqParams)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
