import { Channels } from "channels";
import { channelsActions } from "@actions/channelsActions";
import { ChannelType } from "@store/types/channelType";

export interface ChannelsRes {
  result: Channels[];
  status: Status;
  error: string | null;
}
interface channelsState {
  channels: ChannelsRes;
}
const initialState: channelsState = {
  channels: {
    result: [],
    status: "idle",
    error: null,
  },
};
export default function channelReducer(
  state: channelsState = initialState,
  action: channelsActions.Actions
): channelsState {
  switch (action.type) {
    case ChannelType.REQUEST_CHANNELS:
      return {
        ...state,
        channels: { status: "pending", result: [], error: null },
      };
    case ChannelType.REQUEST_CHANNELS_SUCCESS:
      return {
        ...state,
        channels: { status: "success", result: action.payload, error: null },
      };
    case ChannelType.REQUEST_CHANNELS_ERROR:
      return {
        ...state,
        channels: { status: "error", result: [], error: action.error },
      };
    default:
      return state;
  }
}
