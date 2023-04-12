import { UserTypes } from "@store/types/userTypes";
import { Credentials } from "@reducers/user.reducer";
import { User } from "user";

export namespace userActions {
  // 保存用户登录凭证
  export interface saveUserCredential {
    type: UserTypes.SAVE_USER_CREDENTIALS;
    payload: Credentials;
  }
  // 获取用户个人信息
  export interface requestUserProfile {
    type: UserTypes.REQUEST_USER_PROFILE;
  }
  // 获取用户个人信息成功
  export interface requestUserProfileSuccess {
    type: UserTypes.REQUEST_USER_PROFILE_SUCCESS;
    payload: User;
  }
  // 获取用户个人信息失败
  export interface requestUserProfileError {
    type: UserTypes.REQUEST_USER_PROFILE_ERROR;
    error: string | null;
  }
  // 退出登录清空用户信息
  export interface clearUser {
    type: UserTypes.CLEAR_USER;
  }
  export type Actions =
    | saveUserCredential
    | requestUserProfile
    | requestUserProfileSuccess
    | requestUserProfileError
    | clearUser;
}
