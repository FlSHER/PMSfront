import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import PersonInfo from '../../../components/PersonInfo';
import style from '../index.less';
import styles from '../../common.less';
@connect(({ buckle }) => ({
  baseDetails: buckle.buckleDetails,
}))
export default class RankingGroup extends React.Component {
  state = {
    foreignKey: '',
  }

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    const { id } = params;
    this.setState({
      foreignKey: id,
    });
    dispatch({
      type: 'buckle/getBaseDetail',
      payload: { foreignKey: id },
    });
  }

getPointType = (details) => {
  const types = ['max_point', 'position', 'certificate'];
  const cur = [];
  types.forEach((type) => {
    const [curType] = details.filter(item => item.type === type);
    cur.push(curType);
  });
  return cur;
}

render() {
  const { baseDetails = {} } = this.props;
  const { foreignKey } = this.state;
  const detail = baseDetails[`${foreignKey}`] || {};
  const { details } = detail;
  const uerInfo = {
    realname: detail.staff_name,
    staff_sn: detail.staff_sn,
    department: {
      full_name: detail.department_name,
    },
    brand: {
      name: detail.brand_name,
    },
  };
  if (!details) { return null; }
  const [maxPoint, position, certificate] = this.getPointType(details);
  // const [maxPoint] = details.filter(item => item.type === 'position');
  // const [maxPoint] = details.filter(item => item.type === 'position');
  // const [maxPoint] = details.filter(item => item.type === 'position');

  return (
    <div
      className={styles.con}
      direction="column"
    >
      <div className={styles.con_content}>
        <WhiteSpace size="md" />
        <WingBlank>
          <PersonInfo info={uerInfo} />
        </WingBlank>
        <WhiteSpace size="md" />
        <WingBlank>
          <div className={style.base_point}>
            <span>基础分</span>
            <span>{detail.point_b}</span>
          </div>
        </WingBlank>
        <WhiteSpace size="md" />
        <WingBlank>
          <p className={style.construct}>积分构成</p>
        </WingBlank>
        {maxPoint && (
          <React.Fragment>
            <WingBlank>
              <div className={style.card}>
                <div className={style.card_title}>
                  <span>工龄分</span>
                  <span>{maxPoint.point}</span>
                </div>
                <div className={style.card_content}>
                  <div className={style.item}>
                    <div className={style.item_title}>
                      <span>工龄:{maxPoint.data['工龄']}</span>
                    </div>
                    <span className={style.remark}>入职时间:{maxPoint.data['入职时间']}</span>
                  </div>
                </div>
              </div>
            </WingBlank>
            <WhiteSpace size="md" />
          </React.Fragment>
          )}
        {position && (
        <React.Fragment>
          <WingBlank>
            <div className={style.card}>
              <div className={style.card_title}>
                <span>职位分</span>
                <span>{position.point}</span>
              </div>
              <div className={style.card_content}>
                <div className={style.item}>
                  <div className={style.item_title}>
                    <span>职位{position.data['职位']}</span>
                  </div>
                </div>
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
        </React.Fragment>
        )}
        {certificate && (
          <WingBlank>
            <div className={style.card}>
              <div className={style.card_title}>
                <span>证书分</span>
                <span>{certificate.point}</span>
              </div>
              <div className={style.card_content}>
                {certificate.data.map((item, i) => {
        const idx = i;
        return (
          <div className={style.item} key={idx}>
            <div className={style.item_title}>
              <span>{item.name}</span>
              <span>{item.point}</span>
            </div>
            <span className={style.remark}>{item.description || '暂无'}</span>
          </div>
        );
      })}
              </div>
            </div>
          </WingBlank>

)}

      </div>
    </div>
  );
}
}
