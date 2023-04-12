import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { store } from "@src/store";
import { history } from "@src/App";

export default class RequestManager {
  // 私有的静态属性 存储单例对象
  private static _singleton: RequestManager | undefined;
  // 私有只读的axios实例对象
  private readonly _axios_instance: AxiosInstance;
  // 私有构造函数，禁止外部通过new的方式创建实例对象
  private constructor() {
    // axios实例对象
    this._axios_instance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });
    // 注册请求拦截器
    this._axios_instance.interceptors.request.use(this._authorization);
    // 注册响应拦截器 use的参数一：成功响应，参数二：失败响应
    this._axios_instance.interceptors.response.use(
      this._getServerResponse,
      this._unAuthorization
    );
  }
  // 请求拦截器的 用户权限验证
  private _authorization(config: AxiosRequestConfig) {
    // 获取状态
    const state = store.getState();
    // 获取token
    const token = state.userReducer.credentials.token;
    // 如果token存在，将token添加到请求头信息中
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    // 返回修改过后的config配置
    return config;
  }
  // 获取服务端返回的数据，简化数据层级
  private _getServerResponse(response: AxiosResponse) {
    return response.data;
  }
  // 处理401
  private _unAuthorization(error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        history.push("/login");
      }
    }
    // 继续向外抛出错误
    return Promise.reject(error);
  }
  // 静态方法，供外部访问单例对象
  public static get instance() {
    // 如果是第一次通过instance方法访问单例对象，单例对象不存在 创建单例对象，
    if (typeof RequestManager._singleton === "undefined") {
      RequestManager._singleton = new RequestManager();
    }
    // 如果不是第一次，就返回已经创建好的单例对象
    return RequestManager._singleton;
  }
  // 外部发送请求使用的方法
  // 类方法request返回了axios实例对象的request方法 所以它是一个泛型类，返回promise
  // 泛型参数一：是服务端返回的数据的类型(.then((response)=>{},是这里response的类型，传递给了Promise对象)
  // 参数参数二：是向服务端发送请求时传递的数据的类型（data的类型，传递给了请求配置AxiosRequestConfig)
  public request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    return this._axios_instance.request(config);
  }
}
// 测试代码 发送请求
// RequestManager.instance
//   .request<{ name: string }, { age: number }>({ url: "", data: { age: 20 } })
//   .then((response) => {
//     console.log(response);
//   });
