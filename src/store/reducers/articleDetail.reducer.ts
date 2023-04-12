import { ArticleDetail } from "article";
import { ArticleDetailActions } from "@actions/articleDetailActions";
import { ArticleDetailTypes } from "@store/types/articleDetailTypes";

export interface ArticleDetailRes {
  result: Partial<ArticleDetail>;
  status: Status;
  error: string | null;
}
interface States {
  articleDetail: ArticleDetailRes;
}
const initialState: States = {
  // 文章详情相关状态
  articleDetail: {
    result: {},
    status: "idle",
    error: null,
  },
};
export default function articleDetailReducer(
  state: States = initialState,
  action: ArticleDetailActions.Actions
): States {
  switch (action.type) {
    case ArticleDetailTypes.REQUEST_ARTICLE_DETAIL:
      return {
        ...state,
        articleDetail: { result: {}, error: null, status: "pending" },
      };
    case ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_SUCCESS:
      return {
        ...state,
        articleDetail: {
          result: action.payload,
          error: null,
          status: "success",
        },
      };
    case ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_ERROR:
      return {
        ...state,
        articleDetail: { result: {}, error: action.error, status: "error" },
      };
    default:
      return state;
  }
}
