import { ThunkAction } from "redux-thunk";
import { ArticleActions } from "@actions/articleActions";
import { AppState } from "@src/store";
import { ArticleTypes } from "@store/types/articleTypes";
import { AxiosError } from "axios";
import { requestArticleList } from "@requests/article";
import { requestArticleParams } from "article";

export namespace ArticleCreator {
  // 请求文章列表
  export const requestArticles =
    (
      reqParams?: Partial<requestArticleParams>
    ): ThunkAction<
      Promise<ArticleActions.Actions>,
      AppState,
      undefined,
      ArticleActions.Actions
    > =>
    async (dispatch) => {
      // 将请求状态更改为pending
      dispatch({ type: ArticleTypes.REQUEST_ARTICLE });
      // 捕获错误
      try {
        // 发送请求，获取数据
        const response = await requestArticleList(reqParams);
        // 更改请求状态为成功，保存响应结果
        return dispatch({
          type: ArticleTypes.REQUEST_ARTICLE_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        // 如果是axios错误，保存错误信息
        if (error instanceof AxiosError) {
          return Promise.reject(
            dispatch({
              type: ArticleTypes.REQUEST_ARTICLE_ERROR,
              error: error.response?.data.error,
            })
          );
        }
        // 如果是别的类型的错误，报错错误信息
        return Promise.reject(
          dispatch({
            type: ArticleTypes.REQUEST_ARTICLE_ERROR,
            error: (error as Error).message,
          })
        );
      }
    };
}
