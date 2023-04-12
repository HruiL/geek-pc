import RequestManager from "@src/untils/RequestManager";
import { FormState } from "@pages/loginPage";
import { GeekResponse } from "Response";
import { Credentials } from "@reducers/user.reducer";

// 登录请求
export function LoginRequest(auth: Pick<FormState, "mobile" | "code">) {
  return RequestManager.instance.request<GeekResponse<Credentials>>({
    url: "/authorizations",
    method: "post",
    data: auth,
  });
}
