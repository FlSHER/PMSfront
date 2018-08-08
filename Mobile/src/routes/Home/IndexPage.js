import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Grid } from 'antd-mobile';
import { indexMenu } from '../../utils/convert';
import styles from '../common.less';
import style from './index.less';

function IndexPage({ history }) {
  return (
    <div className={styles.con}>
      {
        indexMenu.map((item, i) => {
          const idx = i;
          return (
            <div key={idx}>
              <WhiteSpace size="md" />
              <WingBlank>
                <div className={style.entrance}>
                  <div className={style.title}> {item.name}</div>
                  <Grid
                    hasLine={false}
                    data={item.children}
                    columnNum={4}
                    square={false}
                    renderItem={dataItem => (
                      <div>
                        <img src={dataItem.icon} alt={dataItem.text} style={{ width: '40px' }} />
                        <div style={{ color: 'rgb(10,10,10)', fontSize: '14px', marginTop: '4px' }}>
                          <span>{dataItem.text}</span>
                        </div>
                      </div>
                    )}
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
