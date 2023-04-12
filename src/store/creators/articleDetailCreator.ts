import { ThunkAction } from "redux-thunk";
import { AppState } from "@src/store";
import { requestArticleDetail } from "@requests/article";
import { AxiosError } from "axios";
import { ArticleDetailTypes } from "@store/types/articleDetailTypes";
import { ArticleDetailActions } from "@actions/articleDetailActions";

export namespace articleDetailCreator {
  // 请求文章详情
  export const articleDetail =
    (
      id: string
    ): ThunkAction<
      Promise<ArticleDetailActions.Actions>,
      AppState,
      undefined,
      ArticleDetailActions.Actions
    > =>
    async (dispatch) => {
      dispatch({ type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL });
      try {
        const response = await requestArticleDetail(id);
        return dispatch({
          type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          return Promise.reject(
            dispatch({
              type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_ERROR,
              error: error.response?.data.message,
            })
          );
        }
        return Promise.reject(
          dispatch({
            type: ArticleDetailTypes.REQUEST_ARTICLE_DETAIL_ERROR,
            error: (error as Error).message,
          })
        );
      }
    };
}
