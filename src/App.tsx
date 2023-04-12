import React, { Component, lazy, Suspense } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import isLogin from "@src/untils/isLogin";
import Loading from "@shared/loading";
const LoginPage = lazy(() => import("@pages/loginPage"));
const Layout = lazy(() => import("@shared/layout"));
const DashBoard = lazy(() => import("@pages/dashboardPage"));
const RouteGuard = lazy(() => import("@shared/routeGuard"));
const ArticlePage = lazy(() => import("@pages/articlePage"));
const PublishPage = lazy(() => import("@pages/publishPage"));
// createBrowserHistory 表示要使用浏览器历史记录api的history路由
// createHashHistory 表示要用hash路由
export const history = createBrowserHistory();
class App extends Component {
  render() {
    return (
      // 通过Router的history属性来指定，当前使用的是 history路由还是hash路由
      <Router history={history}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Redirect from="/" to="/login" exact></Redirect>
            <Route path={"/login"} component={LoginPage}></Route>
            <Route path="/admin">
              <RouteGuard
                onRejected={() => <Redirect to="/login" />}
                guards={[isLogin]}
              >
                <Layout>
                  <Switch>
                    <Redirect from="/admin" to="/admin/dashboard" exact />
                    <Route path="/admin/dashboard" component={DashBoard} />
                    <Route path="/admin/article" component={ArticlePage} />
                    <Route path="/admin/publish/:id" component={PublishPage} />
                    <Route path="/admin/publish" component={PublishPage} />
                  </Switch>
                </Layout>
              </RouteGuard>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

export default App;
