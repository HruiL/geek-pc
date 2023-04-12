import React, { Component } from "react";
import styles from "./index.module.css";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { AppState, AppThunkDispatch } from "@src/store";
import { UserProfile } from "@reducers/user.reducer";
import { userActions } from "@actions/userActions";
import { userCreator } from "@store/creators/userCreator";
import Confirm from "@shared/confirm";
import { history } from "@src/App";
interface StateProps {
  user: UserProfile;
}
interface OwnProps {}
interface DispatchProps {
  // 请求用户个人信息
  requestUserProfile: () => Promise<userActions.Actions>;
  // 退出登录清空用户信息
  clearUser: () => userActions.clearUser;
}
type Props = StateProps & OwnProps & DispatchProps;
interface State {
  isOpen: boolean;
}
class Header extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.loginOutHandler = this.loginOutHandler.bind(this);
  }
  // 页面挂载完成之后请求用户个人信息
  async componentDidMount() {
    await this.props.requestUserProfile();
  }
  // 退出登录
  loginOutHandler() {
    // 清除用户信息
    this.props.clearUser();
    // 跳转到登录页
    history.push("/login");
  }
  render() {
    const { user } = this.props;
    if (user.status === "idle") return;
    if (user.status === "pending") return <div>loading...</div>;
    if (user.status === "error") return <div>{user.error}</div>;
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={require("@image/logo.png")} alt="极客园" />
        </div>
        <div className={styles.user}>
          <span>{user.result.name}</span>
          <button
            className="button is-ghost has-text-white"
            onClick={() => this.setState({ isOpen: true })}
          >
            退出
          </button>
        </div>
        <Confirm
          isOpen={this.state.isOpen}
          close={() => this.setState({ isOpen: false })}
          content={"您确定要退出登录吗"}
          onSureButtonClickHandler={this.loginOutHandler}
        />
      </div>
    );
  }
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  user: state.userReducer.user,
});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  requestUserProfile: () => dispatch(userCreator.requestUserProfile()),
  clearUser: () => dispatch(userCreator.clearUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
