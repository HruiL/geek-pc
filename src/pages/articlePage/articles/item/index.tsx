import React, { Component } from "react";
import { Article } from "article";
import { history } from "@src/App";
interface Props {
  article: Article;
  deleteConfirmOpen: (id: string) => void;
}
class Item extends Component<Props> {
  render() {
    const { article } = this.props;
    return (
      <tr>
        <td>
          {article.cover.type === 0 ? (
            <img src={require("@image/placeholder.png")} width="200" alt="" />
          ) : (
            <img src={article.cover.images[0]} width="200" alt="" />
          )}
        </td>
        <td>{article.title}</td>
        <td>
          {article.status === 0 && <span className="tag is-info">草稿</span>}
          {article.status === 1 && <span className="tag is-link">待审核</span>}
          {article.status === 2 && (
            <span className="tag is-success">审核通过</span>
          )}
          {article.status === 3 && (
            <span className="tag is-danger">审核失败</span>
          )}
        </td>
        {/* 发布时间 */}
        <td> {article.pubdate}</td>
        {/* 阅读数 */}
        <td>{article.read_count}</td>
        {/* 评论数 */}
        <td>{article.comment_count}</td>
        {/* 点赞数 */}
        <td>{article.like_count}</td>
        <td>
          <button
            className="button is-success is-rounded is-small mr-2"
            onClick={() => history.push(`/admin/publish/${article.id}`)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="button is-danger is-rounded is-small"
            onClick={() => this.props.deleteConfirmOpen(article.id)}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    );
  }
}
export default Item;
