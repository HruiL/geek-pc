import { AppState } from "@src/store";
import { ChannelType } from "@store/types/channelType";
import { requestChannelsList } from "@requests/channel";
import { AxiosError } from "axios";
import { ThunkAction } from "redux-thunk";
import { channelsActions } from "@actions/channelsActions";

export namespace channelsCreator {
  export const requestChannels =
    (): ThunkAction<
      Promise<channelsActions.Actions>,
      AppState,
      undefined,
      channelsActions.Actions
    > =>
    async (dispatch) => {
      dispatch({ type: ChannelType.REQUEST_CHANNELS });
      try {
        const response = await requestChannelsList();
        return dispatch({
          type: ChannelType.REQUEST_CHANNELS_SUCCESS,
          payload: response.data.channels,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          return Promise.reject(
            dispatch({
              type: ChannelType.REQUEST_CHANNELS_ERROR,
              error: error.response?.data?.message,
            })
          );
        }
        return Promise.reject(
          dispatch({
            type: ChannelType.REQUEST_CHANNELS_ERROR,
            error: (error as Error).message,
          })
        );
      }
    };
}
