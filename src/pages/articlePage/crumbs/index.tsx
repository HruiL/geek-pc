import React, { Component } from "react";
import { Link } from "react-router-dom";
interface Props {
  // 动态面包屑的导航名字
  children: string;
  // 动态面包屑的导航地址
  url: string;
}
class Crumbs extends Component<Props> {
  render() {
    return (
      <nav className="breadcrumb p-4 mb-0">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to={this.props.url}>{this.props.children}</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Crumbs;
