/**
 * Created by xiucheren on 16/12/16.
 */
import React from 'react';
import {
  Container,
  List,
  Group
}from 'amazeui-touch';
import '../../style/orderdetails.scss';
var Api = require('../Tools/Api');


/**
 * 新订单
 */
//created("等待到店", "等待到店", "等待到店", "#009900"),
/**
 * 已接车
 */
//recepted("已接车", "已接车", "已接车", "#009900"),
/**
 * 等待确认
 */
//waitConfirm("等待确认", "等待确认", "等待确认", "#eb3341"),
/**
 * 维修中
 */
//repairing("维修中", "维修中", "维修中", ""),

/**
 * 已结算
 */
//balanced("已结算", "待支付", "未支付", "#009900"),

/**
 * 已完成
 */
// completed("已完成", "订单完成", "订单完成", "#333333"),

/**
 * 车主已取消
 */
//ownerCancelled("车主已取消", "车主已取消", "车主已取消", "#333333"),


/**
 * 商家已取消
 */
//shopCancelled("汽修站已取消", "汽修站已取消", "汽修站已取消", "#333333"),


/**
 * 车主已锁定
 */
  // ownerlocked("车主已锁定", "已申请终止", "车主申请终止", "#333333"),
const flowNames = ['预约', '到店', '确认工单', '维修', '支付'];
const orderStatusCode = ['created', 'recepted', 'waitConfirm', 'repairing', 'balanced', 'completed']
export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetail: null,
    }
  }

  componentDidMount() {
    console.log(Api.fetctUserInfo());
    let self = this;
    Api.GET(`http://192.168.1.16:8080/api/owner/serviceOrder/${this.props.location.query.id}.jhtml`, null, (res) => {
      if (res.success) {
        self.setState({
          orderDetail: res.data.orderDetail,
        })
      } else {

      }
    }, (e) => {

    })
  }
  cancelOrder(){

  }
  handleflowState(state){
    switch (state){
      case 'created':
        return 0;
      case 'recepted':
        return 1;
      case 'waitConfirm':
        return 2;
      case 'repairing':
        return 3;
      case 'balanced','completed':
        return 4;
      default:
        return 4;
    }
  }
  createHeader(orderDetail) {
    console.log(window.innerWidth)
    let flowIndex = this.handleflowState(orderDetail.beforeCancelStatus ? orderDetail.beforeCancelStatus : orderDetail.orderStatusCode);
    let greenRight = (window.innerWidth - 30)/4 * (4 - flowIndex);
    return (<div className="order-details-header">
        <div className="order-details-flow-green" style={{right: `${greenRight}px`}}></div>
        <div className="order-details-flow-gray"></div>
        <div className="order-details-flow">
          {
            flowNames.map((item, index) => {
              return (<div key={index} className="order-details-flow-item">
                <img src={`../i/oder-details-${index <= flowIndex ? 'select' :'normal'}.png`}/>
                <p>{item}</p>
              </div>)
            })
          }
        </div>
        <div className="order-details-state">
          <p className="state">{orderDetail.orderStatusName}</p>
          <p className="sn">{`订单号${orderDetail.sn}`}</p>
        </div>
        {
          flowIndex <=2 ? <button onClick={()=>{

          }
          }>取消订单</button> : null
        }
      </div>
    )
  }

  render() {
    const {orderDetail} = this.state;
    return (<Container>
      {
        orderDetail ?
          (<List className='order-details-list'>
            <List.Item>
              {
                this.createHeader(orderDetail)
              }
            </List.Item>
            <div className="order-details-section"></div>
            <List.Item title = "汽修站信息"/>
            <List.Item title = {<div className="order-details-garage">
              <div>
                <p>{orderDetail.serviceShopName}</p>
                <p>{`预计交车 ${orderDetail.expectReturnDate}`}</p>
              </div>
              <img src="../i/oder-details-tel.png" onClick={()=>{
                window.location.href = `tel:${orderDetail.bringerPhone}`
              }
              }/>
            </div>}/>
            <div className="order-details-section"></div>
            {
              this.handleflowState(orderDetail.orderStatusCode) == 1 ? <div>
                <List.Item title = {<div className="order-details-waitConfirm">
                  <img src="../i/oder-detals-waitConfirm.png"/>
                  <p>车辆检查完毕汽修站将第一时间编辑服务项目和所需配件，请耐心等待！</p>
                </div>}/>
                <div className="order-details-section"></div>
              </div> : null
            }
            <List.Item title = "车辆信息"/>
            <List.Item title={<div className="order-details-vehicle">
              <p>{`车牌号  ${orderDetail.vehicleNumber}`}</p>
              <p>{`车   型  ${orderDetail.vehicleName}`}</p>
            </div>}/>

          </List>)
          :
          null
      }
    </Container>);
  }
}
