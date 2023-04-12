import { ChannelType } from "@store/types/channelType";
import { Channels } from "channels";

export namespace channelsActions {
  export interface RequestChannels {
    type: ChannelType.REQUEST_CHANNELS;
  }
  export interface RequestChannelsSuccess {
    type: ChannelType.REQUEST_CHANNELS_SUCCESS;
    payload: Channels[];
  }
  export interface RequestChannelsError {
    type: ChannelType.REQUEST_CHANNELS_ERROR;
    error: string | null;
  }
  export type Actions =
    | RequestChannels
    | RequestChannelsSuccess
    | RequestChannelsError;
}
