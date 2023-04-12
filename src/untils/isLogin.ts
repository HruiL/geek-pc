import { store } from "@src/store";

export default async function isLogin() {
  // 获取用户token
  const token = store.getState().userReducer.credentials.token;
  // 模拟异步，因为RouteGuard要求鉴权函数得是异步函数
  // Promise如果不调用resolve，代码便会阻塞，知道成功态调用完成之后代码才会继续向下执行
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return typeof token !== "undefined";
}
