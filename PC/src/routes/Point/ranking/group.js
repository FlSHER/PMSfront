import React from 'react';
import { Progress, Radio, Select, Tooltip, Button } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DatePicker } from '../../../components/OAForm';
import OATable from '../../../components/OATable';
import { getUrlString } from '../../../utils/utils';
import styles from './index.less';

const RadioGroup = Radio.Group;
const { Option } = Select;

const { RangePicker, MonthPicker } = DatePicker;
const format = 'YYYY-MM';
const thisMonth = moment().format(format);

const stage = {
  start_at: moment().subtract(7, 'month').format(format),
  end_at: moment().subtract(1, 'month').format(format),
};


function disabledDate(current) {
  return current && current > moment().endOf('day');
}

function TableCell(props) {
  const { dataIndex, ...restProps } = props;
  return (
    <td {...restProps} style={{ ...(dataIndex ? { color: '#59c3c3' } : {}) }}>
      {restProps.children}
    </td>
  );
}


@connect(({ point, loading }) => ({
  ranking: point.rankDetails,
  staffAuthority: point.staffAuthority,
  loading: (
    loading.effects['point/fetchRank']
    ||
    loading.effects['point/fetchStaffAuthority']
  ),
}))
export default class extends React.Component {
  constructor(props) {
    super(props);
    const state = getUrlString('state');
    const { staffAuthority } = props;
    if (state) {
      const obj = JSON.parse(state);
      this.state = {
        rangeValue: obj.rangeValue,
        filters: {
          ...obj.filters,
          group_id: staffAuthority.statis_group ? obj.filters.group_id : null,
        },
      };
    } else {
      this.state = {
        rangeValue: [stage.start_at, stage.end_at],
        filters: {
          stage: 'month',
          datetime: thisMonth,
          group_id: null,
          start_at: stage.start_at,
          end_at: stage.end_at,
        },
      };
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'point/fetchStaffAuthority' });
  }

  componentWillReceiveProps(nextProps) {
    const { staffAuthority } = nextProps;
    const { filters } = this.state;
    if (staffAuthority && staffAuthority.statis_group && !filters.group_id) {
      this.setState({
        filters: {
          ...filters,
          group_id: staffAuthority.statis_group[0].id,
        },
      }, this.replaceUrl);
    }
  }

  makeParams = () => {
    const { filters } = this.state;
    let params = {
      stage: filters.stage,
      group_id: filters.group_id,
    };
    if (filters.stage === 'month') {
      params.datetime = filters.datetime;
    }
    if (filters.stage === 'stage') {
      params = {
        ...params,
        start_at: filters.start_at,
        end_at: filters.end_at,
      };
    }
    return params;
  }

  fetch = (update) => {
    const { dispatch } = this.props;
    const params = this.makeParams();
    dispatch({
      type: 'point/fetchRank',
      payload: params,
      update: update || false,
    });
  }

  replaceUrl = () => {
    const { activeKey } = this.props;
    const state = JSON.stringify(this.state);
    window.history.replaceState(null, null, `/point/ranking?activeKey=${activeKey}&state=${state}`);
    this.fetch();
  }

  handleRadioChange = (e) => {
    const { value } = e.target;
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        stage: value,
      },
    }, this.replaceUrl);
  }

  handlePanelChange = (date) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        datetime: moment(date).format(format),
      },
    }, this.replaceUrl);
  }

  handleRangePickerChange = (value) => {
    const { filters } = this.state;
    this.setState({
      rangeValue: [value[0].format(format), value[1].format(format)],
      filters: {
        ...filters,
        start_at: value[0].format(format),
        end_at: value[1].format(format),
      },
    }, this.replaceUrl);
  }

  handleChange = (value) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        group_id: value,
      },
    }, this.replaceUrl);
  }

  handleDatePickerVisible = (store) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        stage: store,
      },
    }, this.replaceUrl);
  }

  makeColumns = () => {
    const { ranking, activeKey } = this.props;
    const key = JSON.stringify(this.makeParams());
    const rankValue = ranking[key] || {};
    const rankList = rankValue.list || [];
    let first = 0;
    if (rankList[0]) {
      first = rankList[0].total;
      rankList.forEach((item) => {
        if (parseFloat(item.total) > parseFloat(first)) {
          first = item.total;
        }
      });
    }
    const userInfo = window.user || {};
    const columns = [{
      title: '排名',
      width: 90,
      dataIndex: 'rank',
      onCell: (record) => {
        if (userInfo.staff_sn === record.staff_sn) {
          return { dataIndex: 'rank' };
        }
      },
    }, {
      title: '姓名',
      width: 150,
      dataIndex: 'staff_name',
      searcher: true,
      onCell: (record) => {
        if (userInfo.staff_sn === record.staff_sn) {
          return { dataIndex: 'staff_name' };
        }
      },
    }, {
      title: '积分',
      dataIndex: 'total',
      sorter: true,
      width: 370,
      render: (point, record) => {
        const percent = first ? (point / first).toFixed(2) * 100 : 0;
        const style = {};
        if (userInfo.staff_sn === record.staff_sn) {
          style.color = '#59c3c3';
        }
        return (
          <React.Fragment>
            <span style={style}>{point}</span>
            <span style={{ display: 'inline-block', width: '300px', float: 'right' }}>
              <Progress
                percent={percent}
                strokeColor="#59c3c3"
                showInfo={false}
              />
            </span>
          </React.Fragment>
        );
      },
    }, {
      title: '操作',
      width: 90,
      render: (_, record) => {
        let color = '#59c3c3';
        let onClick = () => {
          const state = JSON.stringify(this.state);
          this.props.dispatch(
            routerRedux.push(`/point/ranking/count/${record.staff_sn}?activeKey=${activeKey}&state=${state}`)
          );
        };
        if (record.disable) {
          color = '#c8c8c8';
          onClick = () => { };
        }
        return (
          <React.Fragment>
            <a
              style={{ color }}
              onClick={onClick}
            >查看
            </a>
          </React.Fragment>
        );
      },
    }];
    return columns;
  }

  render() {
    const { filters, rangeValue } = this.state;
    const { datetime } = filters;
    const { staffAuthority, ranking, type, loading } = this.props;
    const groupData = staffAuthority[type] || [];
    const key = JSON.stringify(this.makeParams());
    const rankValue = ranking[key] || {};
    const userRank = rankValue.user || {};
    const columns = this.makeColumns();
    const components = {
      body: {
        cell: TableCell,
      },
    };
    const monthVisble = classNames(styles.disclander, {
      [styles.hiddenPicker]: filters.stage === 'month',
    });
    const stageVisble = classNames(styles.disclander, {
      [styles.hiddenPicker]: filters.stage === 'stage',
    });

    return (
      <div className={styles.container}>
        <div className={styles.filters}>
          <Tooltip title="刷新数据">
            <Button
              icon="sync"
              onClick={() => this.fetch(true)}
            />
          </Tooltip>
          <Select
            showSearch
            value={filters.group_id}
            style={{ width: 160, marginLeft: 10, marginRight: 40 }}
            placeholder="请选择分组"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) => {
              return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {groupData.map(item => (
              <Option value={item.id} key={item.id}>{item.name}</Option>
            ))}
          </Select>
          <RadioGroup
            className={styles.header}
            onChange={this.handleRadioChange}
            value={filters.stage}
          >
            <Radio value="month">
              月度排名
            </Radio>
            <MonthPicker
              format={format}
              defaultValue={moment(datetime, format)}
              allowClear={false}
              onChange={this.handlePanelChange}
              disabledDate={disabledDate}
              className={monthVisble}
              onFocus={() => this.handleDatePickerVisible('month')}
              style={{ width: '80px', marginRight: '10px' }}
            />
            <Radio value="stage">
              阶段排名
            </Radio>
            <RangePicker
              format={format}
              value={[moment(rangeValue[0], format), moment(rangeValue[1], format)]}
              allowClear={false}
              mode={['month', 'month']}
              disabledDate={disabledDate}
              placeholder={['开始时间', '结束时间']}
              onPanelChange={this.handleRangePickerChange}
              className={stageVisble}
              style={{ width: '150px', marginRight: '10px' }}
              onFocus={() => this.handleDatePickerVisible('stage')}
            />
            <Radio value="total">累计排名</Radio>
          </RadioGroup>
        </div>
        {type === 'auth_group' && (
          <div className={styles.myRangking}>
            <span>我的排名：{userRank.rank || 0}</span>
            <span>我的积分：{userRank.total || 0}</span>
          </div>
        )}
        <OATable
          autoScroll
          columns={columns}
          components={components}
          dataSource={rankValue.list || []}
          loading={loading}
          operatorVisble={false}
          pagination={false}
        />
      </div>
    );
  }
}
