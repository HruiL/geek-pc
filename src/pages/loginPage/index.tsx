import React, { ChangeEvent, Component, FormEvent } from "react";
import styles from "./index.module.css";
import logo from "@image/logo.png";
import { undefined, z, ZodError } from "zod";
import { LoginRequest } from "@requests/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { userActions } from "@actions/userActions";
import { AppThunkDispatch } from "@src/store";
import { userCreator } from "@store/creators/userCreator";
import { Credentials } from "@reducers/user.reducer";
import { RouteComponentProps } from "react-router-dom";
// 表单数据类型
export interface FormState {
  mobile: string;
  code: string;
  agree: boolean;
}
// 表单校验错误信息类型
interface FormErrors {
  mobile?: string[];
  code?: string[];
  agree?: string[];
}
// 组件状态类型
interface State {
  formState: FormState;
  forErrors: FormErrors;
  loginRequestStatus: Status;
  loginRequestError: string | null;
}
interface DispatchProps {
  saveUserCredentials(credentials: Credentials): userActions.saveUserCredential;
}
interface OwnProps {}
// 组件props类型
type Props = DispatchProps & OwnProps & RouteComponentProps;

// 表单校验规则
const formSchema = z.object({
  mobile: z
    .string()
    .min(1, "请输入手机号")
    .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  code: z
    .string()
    .min(1, "请输入验证码")
    .regex(/^\d{6}$/, "手机验证码格式不正确"),
  // literal是字面量的意思，第一个参数表示字面的值是什么，agree只能是true的时候才可以提交登录，第二个参数是不传之后显示的错误信息
  agree: z.literal(true, { errorMap: () => ({ message: "请勾选用户协议" }) }),
});
class LoginPage extends Component<Readonly<Props>, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // 表单状态
      formState: {
        mobile: "13911111111",
        code: "246810",
        agree: true,
      },
      forErrors: {},
      loginRequestStatus: "idle",
      loginRequestError: null,
    };
    // 更改事件函数的this指向
    this.updateFormState = this.updateFormState.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.validateField = this.validateField.bind(this);
  }
  // 更改form表单的状态
  updateFormState(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      formState: {
        ...this.state.formState,
        // 修改哪个哪个状态，按name区分，但是复选框特殊，特殊情况特殊处理
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
    });
  }
  // 点击登录按钮
  async loginHandler(event: FormEvent<HTMLFormElement>) {
    // 阻止表单提交的默认行为
    event.preventDefault();
    // 如果正在发请求，阻止代码继续向下执行
    if (this.state.loginRequestStatus === "pending") return;
    // 进行表单校验
    try {
      formSchema.parse(this.state.formState);
      // 表单校验通过，将表单字段的错误信息置空 更改请求状态为pending
      this.setState({
        ...this.state,
        forErrors: {},
        loginRequestStatus: "pending",
        loginRequestError: null,
      });
      try {
        const response = await LoginRequest({
          mobile: this.state.formState.mobile,
          code: this.state.formState.code,
        });
        toast.success("登录成功", { position: "top-center" });
        this.setState({
          ...this.state,
          loginRequestStatus: "success",
          loginRequestError: null,
        });
        this.props.saveUserCredentials(response.data);
        this.props.history.push("/admin/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          this.setState({
            ...this.state,
            loginRequestStatus: "error",
            loginRequestError: error.response?.data.message,
          });
          toast.error(error.response?.data.message, { position: "top-center" });
        }
      }
      // 发送登录请求
    } catch (error) {
      const zodError = error as ZodError<FormErrors>;
      // 保存字段的错误信息
      this.setState({
        ...this.state,
        forErrors: zodError.formErrors.fieldErrors,
      });
    }
  }
  // 点击登录的时候要渲染错误信息
  renderErrors(field: keyof FormState) {
    return (
      <p className="help is-danger">
        {this.state.forErrors[field] && this.state.forErrors[field]?.[0]}
      </p>
    );
  }
  // 表单的实时校验 验证单个表单字段
  // keyof FormState 拿到的是FormState的类型下的所有属性的 字面量联合类型 "mobile" | "code" | "agree"
  // name的类型要用泛型的原因：value的类型是由name决定的
  // 泛型T要用泛型约束的原因：T不能随便传，只能是在 "mobile" | "code" | "agree" 范围内
  // FormState[T] 类型['属性名'] 得到的是属性值的类型
  validateField<T extends keyof FormState>(name: T, value: FormState[T]) {
    try {
      // formSchema.shape拿到的是校验规则的对象，[name]获取某个字段的校验规则 value要校验的值
      formSchema.shape[name].parse(value);
      // 如果表单字段校验成功，将表单字段的错误信息置为undefined
      this.setState({
        ...this.state,
        forErrors: {
          ...this.state.forErrors,
          [name]: undefined,
        },
      });
    } catch (error) {
      const zodError = error as ZodError<FormErrors>;
      // 保存错误信息
      this.setState({
        ...this.state,
        forErrors: {
          ...this.state.forErrors,
          [name]: zodError.formErrors.formErrors,
        },
      });
    }
  }
  render() {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <img className={styles.logo} src={logo} alt="极客园" />
          <form onSubmit={this.loginHandler}>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="请输入手机号"
                value={this.state.formState.mobile}
                name="mobile"
                onChange={this.updateFormState}
                onInput={(event) =>
                  this.validateField("mobile", event.currentTarget.value)
                }
              />
              {this.renderErrors("mobile")}
            </div>
            <div className="field">
              <input
                className="input"
                type="text"
                placeholder="请输入验证码"
                value={this.state.formState.code}
                name="code"
                onChange={this.updateFormState}
                onInput={(event) =>
                  this.validateField("code", event.currentTarget.value)
                }
              />
              {this.renderErrors("code")}
            </div>
            <div className="field">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={this.state.formState.agree}
                  name="agree"
                  onChange={this.updateFormState}
                  onInput={(event) =>
                    this.validateField("agree", event.currentTarget.checked)
                  }
                />
                <span className="is-size-7 ml-1">
                  我已阅读并同意「用户协议」和「隐私条款」
                </span>
              </label>
              {this.renderErrors("agree")}
            </div>
            <div className="field">
              <button
                className="button is-info is-fullwidth"
                disabled={this.state.loginRequestStatus === "pending"}
              >
                {this.state.loginRequestStatus === "pending"
                  ? "登录中..."
                  : "登陆"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => ({});
const mapDisPatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  saveUserCredentials: (credentials: Credentials) =>
    dispatch(userCreator.saveUserCredentials(credentials)),
});
export default connect(mapStateToProps, mapDisPatchToProps)(LoginPage);
