import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

// import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
// import FastClick from 'fastclick';
import './rollbar';
// import onError from './error';

import './index.less';

moment.locale('zh-cn');
// 1. Initialize
const app = dva({
  history: createHistory(),
  // onError,
});
// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
// FastClick.attach(document.body);

export default app._store; // eslint-disable-line