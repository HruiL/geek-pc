import React, { Component } from "react";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
} from "react-redux";
import { ChannelsRes } from "@reducers/channel.reducer";
import { channelsActions } from "@actions/channelsActions";
import { AppState, AppThunkDispatch } from "@src/store";
import { channelsCreator } from "@store/creators/channelsCreator";
interface StateProps {
  channels: ChannelsRes;
}
interface OwnProps {
  // 默认显示的频道
  defaultChannelId: string | undefined;
  // 更新频道id
  updateChannelId: (id: string) => void;
}
interface DispatchProps {
  requestChannels: () => Promise<channelsActions.Actions>;
}
type Props = StateProps & OwnProps & DispatchProps;
class Channels extends Component<Props> {
  async componentDidMount() {
    await this.props.requestChannels();
  }
  // 更新频道id的方法
  updateChannelIdHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.updateChannelId(event.currentTarget.value);
  };
  render() {
    const { channels } = this.props;
    if (channels.status === "pending") return <div>loading...</div>;
    if (channels.status === "error") return <div>{channels.error}</div>;
    return (
      <div className="select">
        <select
          onChange={this.updateChannelIdHandler}
          value={this.props.defaultChannelId}
        >
          <option>请选择文章频道</option>
          {channels.result.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
const mapStateToProps: MapStateToPropsParam<StateProps, OwnProps, AppState> = (
  state
) => ({
  channels: state.channelReducer.channels,
});
const mapDispatchToProps: MapDispatchToPropsParam<DispatchProps, OwnProps> = (
  dispatch: AppThunkDispatch
) => ({
  requestChannels: () => dispatch(channelsCreator.requestChannels()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Channels);
