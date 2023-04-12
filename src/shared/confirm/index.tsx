import React, { Component, ReactNode } from "react";
import { createPortal } from "react-dom";
interface Props {
  // 控制确认弹框的渲染和销毁
  isOpen: boolean;
  // 确认弹框的标题
  title: string;
  // 确认弹框的内容
  content: ReactNode;
  // 控制确认弹框的销毁
  close: () => void;
  // 点击取消按钮要做的事情
  onSureButtonClickHandler: () => void;
  // 点击确认按钮要做的事情
  onCancelButtonClickHandler: () => void;
}
class Confirm extends Component<Props> {
  static defaultProps = {
    title: "温馨提示",
    onSureButtonClickHandler() {},
    onCancelButtonClickHandler() {},
  };
  render() {
    const {
      isOpen,
      title,
      content,
      close,
      onSureButtonClickHandler,
      onCancelButtonClickHandler,
    } = this.props;
    return isOpen
      ? createPortal(
          <div className="modal is-active">
            <div
              className="modal-background"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            ></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">{title}</p>
                <button className="delete" onClick={close}></button>
              </header>
              <section className="modal-card-body">{content}</section>
              <footer className="modal-card-foot">
                <button
                  className="button is-success"
                  onClick={() => {
                    close();
                    onSureButtonClickHandler();
                  }}
                >
                  确定
                </button>
                <button
                  className="button is-info"
                  onClick={() => {
                    close();
                    onCancelButtonClickHandler();
                  }}
                >
                  取消
                </button>
              </footer>
            </div>
          </div>,
          document.getElementById("portal-dom")!
        )
      : null;
  }
}

export default Confirm;
