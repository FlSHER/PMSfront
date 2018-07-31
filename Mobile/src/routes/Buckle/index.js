import { Redirect, Switch, Route } from 'dva/router';
import Authorized from '../../utils/Authorized';

const { AuthorizedRoute } = Authorized;

export default class BuckleIndex extends React.PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <Route>
        <Switch>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              )
            )
          }
          {
            redirectData.map(item =>
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            )
          }
          <Redirect exact from="/" to="/home" />
          <Route render={NotFound} />
        </Switch>
      </Route>
    );
  }
}
