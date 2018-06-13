import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, Grid } from 'antd-mobile';
import { indexMenu } from '../utils/convert';
import styles from './common.less';
import style from './index.less';

function IndexPage({ history }) {
  return (
    <div className={styles.con}>
      {
        indexMenu.map((item, i) => {
      const idx = i;
      return (
        <div key={idx}>
          <WhiteSpace size="sm" />
          <WingBlank>
            <div className={style.entrance}>
              <Flex className={style.title}> 参与人列表</Flex>
              <Grid
                hasLine={false}
                data={item.children}
                columnNum={4}
                onClick={el => history.push(el.to)}
              />
            </div>
          </WingBlank>
        </div>
      );
    })}

    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
