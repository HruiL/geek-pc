import { ArticleTypes } from "@store/types/articleTypes";
import { Pagination } from "Response";
import { Article, ArticleDetail } from "article";

export namespace ArticleActions {
  // 请求文章列表
  export interface RequestArticles {
    type: ArticleTypes.REQUEST_ARTICLE;
  }
  // 请求文章列表成功
  export interface RequestArticlesSuccess {
    type: ArticleTypes.REQUEST_ARTICLE_SUCCESS;
    payload: Pagination<Article>;
  }
  // 请求文章列表失败
  export interface RequestArticlesError {
    type: ArticleTypes.REQUEST_ARTICLE_ERROR;
    error: string | null;
  }

  export type Actions =
    | RequestArticles
    | RequestArticlesSuccess
    | RequestArticlesError;
}
