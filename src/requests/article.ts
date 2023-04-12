import RequestManager from "@src/untils/RequestManager";
import { GeekResponse, Pagination } from "Response";
import {
  Article,
  ArticleDetail,
  PublishArticleParams,
  requestArticleParams,
} from "article";
import { AxiosProgressEvent } from "axios";

// 请求文章列表
export function requestArticleList(reqParams?: Partial<requestArticleParams>) {
  return RequestManager.instance.request<GeekResponse<Pagination<Article>>>({
    url: "/mp/articles",
    params: reqParams,
  });
}
// 删除文章
export function deleteArticle(id: string) {
  return RequestManager.instance.request({
    url: `/mp/articles/${id}`,
    method: "delete",
  });
}
// 发布文章
export function publishArticle(
  draft: boolean,
  publishArticleReq: PublishArticleParams
) {
  return RequestManager.instance.request<GeekResponse<{ id: string }>>({
    url: "/mp/articles",
    method: "post",
    data: publishArticleReq,
    params: { draft },
  });
}
// 上传图片
export function uploadImg(
  img: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
  // 创建FormData对象
  const formData = new FormData();
  // 将要上传的图片文件追加到FormData对象中
  formData.append("image", img);
  // 发送文件上传的请求
  return RequestManager.instance.request<GeekResponse<{ url: string }>>({
    url: "/upload",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    // 实现上传进度条 这是一个方法，上传的过程的会实时调用这个方法
    onUploadProgress,
  });
}
// 请求文章详情
export function requestArticleDetail(id: string) {
  return RequestManager.instance.request<GeekResponse<ArticleDetail>>({
    url: `/mp/articles/${id}`,
  });
}
// 修改文章
export function requestModifyArticle(
  id: string,
  draft: boolean,
  article: PublishArticleParams
) {
  return RequestManager.instance.request({
    url: `/mp/articles/${id}`,
    method: "put",
    params: { draft },
    data: article,
  });
}
