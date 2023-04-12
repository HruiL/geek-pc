// src/@types文件会被typescript自动加载，里面的类型不需要被导出和导入，相当于全局类型
// 使用模块化开发
declare module "Response" {
  export interface GeekResponse<T> {
    message: string;
    data: T;
  }
  export interface Pagination<T> {
    // 当前页数
    page: number;
    // 每页数量
    per_page: number;
    // 文章总数
    total_count: number;
    // 文章详情
    results: T[];
  }
}
