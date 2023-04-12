import RequestManager from "@src/untils/RequestManager";
import { GeekResponse } from "Response";
import { Channels } from "channels";

// 请求频道列表
export function requestChannelsList() {
  return RequestManager.instance.request<
    GeekResponse<{ channels: Channels[] }>
  >({
    url: "/channels",
  });
}
