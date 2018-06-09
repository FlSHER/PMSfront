import React from 'react';
import styles from './index.less';

const Error = () => (
  <div className={styles.error}>
    <h4>
      403 Forbidden

      Access to this resource on the server is denied!

      Powered By LiteSpeed Web Server

      LiteSpeed Technologies is not responsible for administration and contents of this web site!
    </h4>
  </div>
);

export default Error;
