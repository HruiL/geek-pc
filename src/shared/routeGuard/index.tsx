import React, { Component, ReactNode } from "react";
interface Props {
  // 鉴权通过之后要渲染的页面
  children: ReactNode;
  // 鉴权失败之后要渲染的页面
  onRejected: () => ReactNode;
  // 鉴权函数，数组里包裹返回布尔值的promise函数
  guards: Array<() => Promise<boolean>>;
}
interface State {
  status: Status;
}
class RouteGuard extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    // 记录鉴权的状态
    this.state = {
      status: "idle",
    };
  }
  // 页面挂载完成之后，开始鉴权
  async componentDidMount() {
    // 更改鉴权状态为pending
    this.setState({ status: "pending" });
    // 一次调用鉴权函数，得到promise数组
    const promiseArray = this.props.guards.map((guard) => guard());
    // Promise.all 接受一个iterable类型的数据，等待数组中所有异步函数都变为成功态的时候，一次性返回一个Promise实例
    const booleanArray = await Promise.all(promiseArray);
    // 获取异步校验的结果
    const isPass = booleanArray.every((item) => item);
    // 根据结果更改组件状态
    this.setState({ status: isPass ? "success" : "error" });
  }

  // 鉴权中要渲染的ui
  pending() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i className="fas fa-spinner fa-pulse is-size-1"></i>
      </div>
    );
  }
  // 鉴权成功要渲染的ui
  success() {
    return this.props.children;
  }
  // 鉴权失败要渲染的ui
  error() {
    return this.props.onRejected();
  }
  render() {
    if (this.state.status === "pending") {
      return this.pending();
    } else if (this.state.status === "success") {
      return this.success();
    } else if (this.state.status === "error") {
      return this.error();
    } else {
      return null;
    }
  }
}

export default RouteGuard;
