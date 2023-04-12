import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import { requestArticleParams } from "article";
import classNames from "classnames";
interface paginationProps {
  // 当前显示第几页，当前页要高亮
  page: number;
  // 数据的总数量，用于计算总页数，限制页码的显示范围
  total: number;
  // 页面中一次最多要显示几页
  maxShowPageCount: number;
  // 每页显示多少条数据
  per_page: number;
  // 更改当前页码
  updateReqParams: (reqParams: Partial<requestArticleParams>) => void;
}
class Pagination extends Component<Readonly<paginationProps>> {
  updatePage(event: React.MouseEvent<HTMLButtonElement>, num: number) {
    event.preventDefault();
    let changePage;
    // 如果页码小于1
    if (this.props.page + num < 1) {
      // 将页码置为1
      changePage = 1;
      // 如果页码大于总页码数
    } else if (
      this.props.page + num >
      Math.ceil(this.props.total / this.props.per_page)
    ) {
      // 将页码置为总页码数
      changePage = Math.ceil(this.props.total / this.props.per_page);
      // 如果页码没有越界，在合理的范围内
    } else {
      changePage = this.props.page + num;
    }
    // 更改页码
    this.props.updateReqParams({ page: changePage });
  }
  renderPagination() {
    const { page, maxShowPageCount, total, per_page } = this.props;
    // 页码的偏移量，用于计算起始页和结束页
    const pageOffset = Math.floor(this.props.maxShowPageCount / 2);
    // 起始页码
    let start = page - pageOffset;
    // 结束页码
    let end = start + maxShowPageCount - 1;
    // 总页数
    const totalPages = Math.ceil(total / per_page);
    // 如果起始页码越界
    if (start < 1) {
      // 将起始页码置为1
      start = 1;
      // 重新计算结束页码
      let temp = start + maxShowPageCount - 1;
      // 结束页码越界判断
      end = temp > totalPages ? totalPages : temp;
    }
    // 如果结束页码越界
    if (end > totalPages) {
      // 将结束页码置为1
      end = totalPages;
      // 重新计算起始页码
      let temp = end - maxShowPageCount + 1;
      // 起始页码越界判断
      start = temp < 1 ? 1 : temp;
    }
    // 页面中显示的页面数据
    let pageLists = [];
    for (let i = start; i <= end; i++) {
      pageLists.push(i);
    }
    return (
      <nav className="pagination">
        <ul className="pagination-list">
          <li>
            <button
              className="pagination-link"
              onClick={(event) => this.updatePage(event, -1)}
            >
              上一页
            </button>
          </li>
          {pageLists.map((page) => (
            <li key={page}>
              <Link
                to="/"
                className={classNames("pagination-link", {
                  "is-current": page === this.props.page,
                })}
                onClick={(event) => {
                  event.preventDefault();
                }}
              >
                {page}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="pagination-link"
              onClick={(event) => this.updatePage(event, 1)}
            >
              下一页
            </button>
          </li>
          <li>
            <div className="select">
              <select
                value={per_page}
                onChange={(event) =>
                  this.props.updateReqParams({
                    per_page: Number(event.currentTarget.value),
                  })
                }
              >
                <option value={10}>10条/页</option>
                <option value={15}>15条/页</option>
                <option value={20}>20条/页</option>
              </select>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
  render() {
    return <div className={styles.pagination}>{this.renderPagination()}</div>;
  }
}

export default Pagination;
