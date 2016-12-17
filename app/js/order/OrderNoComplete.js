/**
 * Created by xiucheren on 16/12/16.
 */
import React from 'react';
import {
  Container,
  Group,
  List,
} from 'amazeui-touch';
import {
  hashHistory,
  Link

}from 'react-router';
import '../../i/app-icon.png';
import '../../i/order-delete.png';
import ReactIScroll from 'reactjs-iscroll';
import iScroll from 'iscroll/build/iscroll-probe';
import '../../style/ordernocomplete.scss';
var Api = require('../Tools/Api');
export default class OrderNoComplete extends React.Component {

  constructor(props) {
    super(props);
    this.loadData.bind(this);
    this.pageNo = 1;
    this.ownerId = null;
    this.state = {
      orderList: [],
      pullUpState: false,
      headerhidden:false,
    }
  }

  componentDidMount() {
    if (Api.fetctUserInfo()) {
      this.ownerId = Api.fetctUserInfo().ownerId;
      this.loadData();
    }
  }

  loadData(callback) {
    if (this.ownerId) {
      let self = this;
      Api.GET('http://192.168.1.16:8080/api/owner/serviceOrder/noComplete.jhtml', {
        ownerId: this.ownerId,
        pageNo: this.pageNo
      }, (res) => {
        var orderList = self.state.orderList;
        if (res.success) {
          orderList = self.pageNo == 1 ? res.data.orderList : orderList.concat(res.data.orderList)
        }
        self.setState({
          orderList: orderList,
          pullUpState: res.data.isNextPage,
        })
        if (callback) {
          callback();
        }

      }, (e) => {
        if (callback) {
          callback();
        }
      })

    } else {
      hashHistory.push({
        pathname: '/owner/login'
      })
    }
  }

  handleRefresh(upordown, callback) {
    if (callback && typeof callback === 'function') {

      if (upordown == 'up') {
        this.pageNo++;
      } else {
        this.pageNo = 1;
      }
      this.loadData(callback);
    }
  }

  render() {
    const {pullUpState, orderList,headerhidden} = this.state;
    return (<Container>
      <ReactIScroll
        iScroll={iScroll}
        ref="refresh"
        pullUp={pullUpState}
        handleRefresh={this.handleRefresh.bind(this)}
      >
        <div className="order-list-header" hidden={headerhidden}>
          <img className="img1" src="../../i/order-delete.png" onClick={()=>{
            this.setState({
              headerhidden:true,
            })
          }}/>
          <img className="img2" src='../../i/app-icon.png'/>
          <p className="p1">下载修车人APP</p>
          <p className="p2">扫码验证正品</p>
          <button onClick={()=>{
            window.location.href = Api.appDownloadUrl()
          }}>立即下载</button>
        </div>
        <List>
          {
            orderList.map((item, index) => {
              return (<Link key = {index} to={{pathname:'/owner/order/details',query:{id:item.id}}}>
                <List.Item className = "order-list-li"
                           title={item.servicerName}
                           after={<p className = "order-list-li-after">{item.statusName}</p>}
                           subTitle={<div>
                             <p className="order-list-li-date">{`到店时间 ${item.date}`}</p>
                             <p className="order-list-li-vehicle">{`${item.vehicleName} 订单号：${item.sn}`}</p>
                           </div>}

                >
                </List.Item>
              </Link>);
            })
          }
        </List>

      </ReactIScroll>
      <div className="order-list-download-url">
        公众号中仅可查看正在维修中的订单，查看更多信息可下载<a href={Api.appDownloadUrl()}>修车人APP</a>
      </div>
    </Container>);
  }
}
