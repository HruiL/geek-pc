export enum UserTypes {
  // 保存用户登录凭证
  SAVE_USER_CREDENTIALS = "user/saveUserCredentials",
  // 获取用户个人信息
  REQUEST_USER_PROFILE = "user/requestUserProfile",
  // 获取用户个人信息成功
  REQUEST_USER_PROFILE_SUCCESS = "user/requestUserProfileSuccess",
  // 获取用户个人信息失败
  REQUEST_USER_PROFILE_ERROR = "user/requestUserProfileError",
  // 退出登录清空用户信息
  CLEAR_USER = "user/clearUser",
}
