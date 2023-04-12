import { ArticleActions } from "@actions/articleActions";
import { Pagination } from "Response";
import { Article } from "article";
import { ArticleTypes } from "@store/types/articleTypes";

export interface ArticleRes {
  result: Partial<Pagination<Article>>;
  status: Status;
  error: string | null;
}

interface ArticleState {
  articles: ArticleRes;
}
const initialState: ArticleState = {
  // 文章列表相关状态
  articles: {
    result: {},
    status: "idle",
    error: null,
  },
};
export default function articleReducer(
  state: ArticleState = initialState,
  action: ArticleActions.Actions
): ArticleState {
  switch (action.type) {
    case ArticleTypes.REQUEST_ARTICLE:
      return {
        ...state,
        articles: { result: {}, status: "pending", error: null },
      };
    case ArticleTypes.REQUEST_ARTICLE_SUCCESS:
      return {
        ...state,
        articles: { result: action.payload, status: "success", error: null },
      };
    case ArticleTypes.REQUEST_ARTICLE_ERROR:
      return {
        ...state,
        articles: { result: {}, status: "error", error: action.error },
      };

    default:
      return state;
  }
}
