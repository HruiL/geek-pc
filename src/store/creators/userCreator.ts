import { Credentials } from "@reducers/user.reducer";
import { userActions } from "@actions/userActions";
import { UserTypes } from "@store/types/userTypes";
import { ThunkAction } from "redux-thunk";
import { AppState } from "@src/store";
import { RequestUserProfile } from "@requests/user";
import { AxiosError } from "axios";

export namespace userCreator {
  // 保存用户登录凭证
  export const saveUserCredentials = (
    credentials: Credentials
  ): userActions.saveUserCredential => ({
    type: UserTypes.SAVE_USER_CREDENTIALS,
    payload: credentials,
  });
  // 获取用户个人信息
  export const requestUserProfile =
    (): ThunkAction<
      Promise<userActions.Actions>,
      AppState,
      undefined,
      userActions.Actions
    > =>
    async (dispatch) => {
      // 更新请求状态为pending
      dispatch({ type: UserTypes.REQUEST_USER_PROFILE });
      // 捕获错误
      try {
        // 发送请求，更新请求状态为成功，并保存服务端返回的用户信息
        const response = await RequestUserProfile();
        return dispatch({
          type: UserTypes.REQUEST_USER_PROFILE_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        // 如果是axios错误
        if (error instanceof AxiosError) {
          return Promise.reject(
            dispatch({
              type: UserTypes.REQUEST_USER_PROFILE_ERROR,
              error: error.response?.data?.message,
            })
          );
        }
        // 如果是别的错误类型
        return Promise.reject(
          dispatch({
            type: UserTypes.REQUEST_USER_PROFILE_ERROR,
            error: (error as Error).message,
          })
        );
      }
    };
  // 退出登录清空用户信息
  export const clearUser = (): userActions.clearUser => ({
    type: UserTypes.CLEAR_USER,
  });
}
