import RequestManager from "@src/untils/RequestManager";
import { GeekResponse } from "Response";
import { User } from "user";

// 获取用户个人信息
export const RequestUserProfile = () => {
  return RequestManager.instance.request<GeekResponse<User>>({
    url: "/user/profile",
  });
};
