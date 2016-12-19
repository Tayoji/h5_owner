/**
 * Created by xiucheren on 16/12/16.
 */
import React from 'react';
import {
  Container,
  List,
  Group,
  Button
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
    Api.GET(`http://192.168.1.6:8000/api/owner/serviceOrder/${this.props.location.query.id}.jhtml`, null, (res) => {
      if (res.success) {
        self.setState({
          orderDetail: res.data.orderDetail,
        })
      } else {

      }
    }, (e) => {

    })
  }

  cancelOrder() {

  }

  handleflowState(state) {
    switch (state) {
      case 'created':
        return 0;
      case 'recepted':
        return 1;
      case 'waitConfirm':
        return 2;
      case 'repairing':
        return 3;
      case 'balanced', 'completed':
        return 4;
      default:
        return -1;
    }
  }

  createHeader(orderDetail) {
    console.log(window.innerWidth)
    let flowIndex = this.handleflowState(orderDetail.beforeCancelStatus ? orderDetail.beforeCancelStatus : orderDetail.orderStatusCode);
    let greenRight = (window.innerWidth - 30) / 4 * (4 - flowIndex);
    return (<div className="order-details-header">
        <div className="order-details-flow-green" style={{right: `${greenRight}px`}}></div>
        <div className="order-details-flow-gray"></div>
        <div className="order-details-flow">
          {
            flowNames.map((item, index) => {
              return (<div key={index} className="order-details-flow-item">
                <img src={`../i/oder-details-${index <= flowIndex ? 'select' : 'normal'}.png`}/>
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
          flowIndex <= 2 ? <button onClick={() => {

          }
          }>取消订单</button> : null
        }
      </div>
    )
  }

  // 服务工单明细
  createServiceItem(items) {
    var services = [],
      parts = [],
      servicesTotalPrice = 0,
      partsTotalPrice = 0;
    for (var i = 0; i < items.length; i++) {
      console.log(i);
      let item = items[i];
      switch (item.typeCode) {
        case 'service':
          services.push(item);
          servicesTotalPrice += item.quantity * item.totalPrice;
          break;
        case 'part':
          parts.push(item);
          partsTotalPrice += item.quantity * item.totalPrice;
          break;
      }
    }
    return (<div>
      {
        items.length > 0 ? <div>
          <List.Item title='服务工单明细'/>
          {/*
           服务项目
           */}
          {
            services.length > 0 ?
              <div className="order-details-service-items">
                <p className="order-details-service-item-header">服务项目</p>
                {
                  services.map((item, index) => {
                    return (<div className="order-details-service-item">
                      <p>{item.name}</p>
                      <p>{`¥${item.totalPrice}`}</p>
                    </div>);
                  })
                }
                <div className="order-details-service-items-footer">
                  <p>小计</p>
                  <p>{`¥${servicesTotalPrice}`}</p>
                </div>
              </div> : null
          }
          {/*
           零配件
           */}
          {
            parts.length > 0 ? <div className="order-details-service-items">
              <p>零配件</p>
              {
                parts.map((item, index) => {
                  return <div className="order-details-service-item">
                    <img />
                    <p>{item.name}</p>
                    <p>{`¥${item.totalPrice}`}</p>
                    <p>{`x${item.name}${item.measureUnit}`}</p>
                  </div>
                })
              }
              <div className="order-details-service-items-footer">
                <p>小计</p>
                <p>{`¥${parts}`}</p>
              </div>
            </div> : null
          }
          <div className="order-details-section"></div>
        </div> : null
      }

    </div>);
  }

  createButton(orderDetail) {
    let index = this.handleflowState(orderDetail.orderStatusCode);
    var  buttonValue =  "";
    switch (index){
      case 2:
        buttonValue = "li";
        break;
    }
    return (
      index < 2 || index == 3 ?
      <Button className="order-details-button">立即评价</Button> : null
    );
  }


  render() {
    const {orderDetail} = this.state;
    return (<Container className="order-details-body">
        {
          orderDetail ?
            (<div>
              <List className='order-details-list'>
              <List.Item>
                {
                  this.createHeader(orderDetail)
                }
              </List.Item>
              <div className="order-details-section"></div>
              <List.Item title="汽修站信息"/>
              <List.Item title={<div className="order-details-garage">
                <div>
                  <p>{orderDetail.serviceShopName}</p>
                  <p>{`预计交车 ${orderDetail.expectReturnDate}`}</p>
                </div>
                <img src="../i/oder-details-tel.png" onClick={() => {
                  window.location.href = `tel:${orderDetail.bringerPhone}`
                }
                }/>
              </div>}/>
              <div className="order-details-section"></div>
              {
                this.handleflowState(orderDetail.orderStatusCode) == 1 ? <div>
                  <List.Item title={<div className="order-details-waitConfirm">
                    <img src="../i/oder-detals-waitConfirm.png"/>
                    <p>车辆检查完毕汽修站将第一时间编辑服务项目和所需配件，请耐心等待！</p>
                  </div>}/>
                  <div className="order-details-section"></div>
                </div> : null
              }
              {
                this.createServiceItem(orderDetail.items)
              }
              <List.Item title="车辆信息"/>
              <List.Item title={<div className="order-details-vehicle">
                <p>{`车牌号  ${orderDetail.vehicleNumber}`}</p>
                <p>{`车   型  ${orderDetail.vehicleName}`}</p>
              </div>}/>
            </List>
              {
                this.createButton(orderDetail)
              }
            </div>)
            :
            null
        }
    </Container>);
  }
}
