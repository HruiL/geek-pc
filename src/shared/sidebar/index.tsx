import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";
class Sidebar extends Component {
  render() {
    return (
      <aside className="menu">
        <ul className={`menu-list ${styles["menu-list"]}`}>
          <li className="mb-3">
            <NavLink
              to="/admin/dashboard"
              activeClassName="is-active"
              className="has-text-white"
            >
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
                <span>数据概览</span>
              </span>
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/admin/article"
              activeClassName="is-active"
              className="has-text-white"
            >
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-tasks"></i>
                </span>
                <span>内容管理</span>
              </span>
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/admin/publish"
              activeClassName="is-active"
              className="has-text-white"
            >
              <span className="icon-text">
                <span className="icon">
                  <i className="far fa-newspaper"></i>
                </span>
                <span>发布文章</span>
              </span>
            </NavLink>
          </li>
        </ul>
      </aside>
    );
  }
}

export default Sidebar;
