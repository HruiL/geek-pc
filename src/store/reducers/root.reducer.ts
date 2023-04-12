import { combineReducers } from "redux";
import userReducer from "@reducers/user.reducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import channelReducer from "@reducers/channel.reducer";
import articleReducer from "@reducers/article.reducer";
import articleDetailReducer from "@reducers/articleDetail.reducer";

export const rootReducer = combineReducers({
  userReducer: persistReducer({ key: "userReducer", storage }, userReducer),
  channelReducer,
  articleReducer,
  articleDetailReducer,
});
