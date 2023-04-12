import { UserTypes } from "@store/types/userTypes";
import { userActions } from "@actions/userActions";
import { User } from "user";

export interface Credentials {
  // 用户登录凭证
  token: string;
  // token过期后的替代者
  refresh_token: string;
}
export interface UserProfile {
  result: Partial<User>;
  status: Status;
  error: string | null;
}
interface UserState {
  credentials: Partial<Credentials>;
  user: UserProfile;
}
const initialState: UserState = {
  // 用户登录凭证
  credentials: {},
  // 用户个人信息
  user: {
    result: {},
    status: "idle",
    error: null,
  },
};
export default function userReducer(
  state: UserState = initialState,
  action: userActions.Actions
): UserState {
  switch (action.type) {
    // 保存用户登录凭证
    case UserTypes.SAVE_USER_CREDENTIALS:
      return { ...state, credentials: action.payload };
    // 获取用户个人信息
    case UserTypes.REQUEST_USER_PROFILE:
      return { ...state, user: { result: {}, status: "pending", error: null } };
    // 获取用户个人信息成功
    case UserTypes.REQUEST_USER_PROFILE_SUCCESS:
      return {
        ...state,
        user: { result: action.payload, status: "success", error: null },
      };
    // 获取用户个人信息失败
    case UserTypes.REQUEST_USER_PROFILE_ERROR:
      return {
        ...state,
        user: { result: {}, status: "error", error: action.error },
      };
    // 退出登录清空用户信息
    case UserTypes.CLEAR_USER:
      return initialState;
    default:
      return state;
  }
}
