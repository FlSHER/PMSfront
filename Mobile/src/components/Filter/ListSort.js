import React from 'react';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import velocity from 'velocity-animate';
import SortView from './Sort';
import '../../assets/css/index.less';
import style from './index.less';

export default class AnimateSort extends React.Component {
  state = {
    height: document.documentElement.clientHeight,
  }

  componentDidMount() {
    const htmlDom = ReactDOM.findDOMNode(this.ptr);
    const offetTop = htmlDom.getBoundingClientRect().top;
    console.log(offetTop);
    const hei = this.state.height - offetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
  }


  animateEnter = (node, done) => {
    let ok = false;
    const newNode = node;
    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    newNode.style.display = 'none';

    velocity(node, 'slideDown', {
      duration: 300,
      complete,
    });
    return {
      stop() {
        velocity(newNode, 'finish');
        // velocity complete is async
        complete();
      },
    };
  }

  animateLeave = (node, done) => {
    let ok = false;
    const newNode = node;
    function complete() {
      if (!ok) {
        ok = 1;
        done();
      }
    }

    newNode.style.display = 'block';

    velocity(node, 'slideUp', {
      duration: 300,
      complete,
    });
    return {
      stop() {
        velocity(newNode, 'finish');
        // velocity complete is async
        complete();
      },
    };
  }

  render() {
    const {
      visible,
      onCancel,
      filterKey,
    } = this.props;
    // const { height } = this.state;
    const conStyle = {
      // height,
      display: visible ? 'block' : 'none',
    };
    const anim = {
      enter: this.animateEnter,
      leave: this.animateLeave,
    };

    return (
      <div
        ref={(e) => { this.ptr = e; }}
        style={conStyle}
        onClick={e => onCancel(e, filterKey)}
        className={style.some_sort}
      >
        <Animate
          showProp="visible"
          animation={anim}
        >
          <SortView {...this.props} />
        </Animate>
      </div>
    );
  }
}
