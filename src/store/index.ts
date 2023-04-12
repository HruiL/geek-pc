import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "@reducers/root.reducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk, { ThunkDispatch } from "redux-thunk";
const middlewares = [thunk];
// 是否启用devtools 只有在开发环境下启用
const enhancers =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(...middlewares))
    : applyMiddleware(...middlewares);
export const store = createStore(rootReducer, enhancers);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<
  AppState,
  undefined,
  Parameters<AppDispatch>[0]
>;
