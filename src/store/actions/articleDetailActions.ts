import { ArticleDetailTypes } from "@store/types/articleDetailTypes";
import { ArticleDetail } from "article";

export namespace ArticleDetailActions {
  // 获取文章详情
  export interface RequestArticleDetail {
    type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL;
  }
  // 获取文章详情成功
  export interface RequestArticleDetailSuccess {
    type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_SUCCESS;
    payload: ArticleDetail;
  }
  // 获取文章详情失败
  export interface RequestArticleDetailError {
    type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_ERROR;
    error: string | null;
  }
  export type Actions =
    | RequestArticleDetail
    | RequestArticleDetailSuccess
    | RequestArticleDetailError;
}
