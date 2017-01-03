/**
 * Created by xiucheren on 16/12/16.
 */
import React from 'react';
import {
  Container,
  List,
  Group,
  Button,
  Modal
}from 'amazeui-touch';
import {hashHistory} from 'react-router';
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
// confirmed 服务中
// ownerCancelled 订单取消
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
    this.loadData.bind(this);
    this.handleLockOrder.bind(this);
    this.cancelOrder.bind(this);
    this.state = {
      orderDetail: null,
      modelProps: {
        title: '',
        role: 'loading',
        isOpen: false,
        subTitle: '',

      },
    }
  }

  componentDidMount() {
    Api.setTitle("详情");
    console.log(Api.fetctUserInfo());
    this.loadData();

  }

  loadData() {
    let self = this;
    Api.GET(`http://192.168.1.12:8080/api/owner/serviceOrder/${this.props.location.query.id}.jhtml`, null, (res) => {
      console.log(res)

      if (res.success) {
        self.setState({
          orderDetail: res.data.orderDetail,
        })
      } else {

      }
    }, (e) => {

    })
  }

  handleClickBottomButton(value) {
    switch (value) {
      case '确定项目及配件':
        this.confirmOrder(true);
        // hashHistory.push({
        //   pathname:'/owner/order/review'
        // })
        break;
      case '支付': {
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          this.onBridgeReady();
        }
      }
        break;
      case "立即评价":
        hashHistory.push({
          pathname:'/owner/order/review'
        })
        break;
    }
  }

  onBridgeReady() {
    let dateStr = `${parseInt((new Date()).getTime() / 1000)}`;
    let nonceStr = `${parseInt(Math.random() * Math.pow(10, 15))}`
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": "wxe9a6bcbd8918cd1d",     //公众号名称，由商户传入
        "timeStamp": "1482992241",         //时间戳，自1970年以来的秒数
        "nonceStr": "4647eb4226a44ae2a03a743b8c55f988", //随机串
        "package": "Sign=WXPay&prepay_id=wx20161229142346988979aa3b0252582382",
        "signType": "MD5",         //微信签名方式：
        "paySign": "D988CB450CDD227CEAB03719A221E5AA",//微信签名
      },
      function (res) {
        alert(JSON.stringify(res))
        if (res.err_msg == "get_brand_wcpay_request：ok") {
        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      }
    )
  }

  cancelOrder(isOpen) {
    let self = this;
    if (isOpen) {
      this.setState({
        modelProps: {
          isOpen: true,
          title: '提示',
          role: 'confirm',
          subTitle: '是否取消订单',
        }
      })
    } else {
      this.setState({
        modelProps: {
          isOpen: true,
          title: '提示',
          role: 'loading',
          subTitle: '',
        }
      })
      Api.GET(Api.url(`/owner/serviceOrder/${this.props.location.query.id}/ownerCancelOrder.jhtml`), {
        id: this.props.location.query.id,
        operator: Api.fetctUserInfo().ownerId
      }, (res) => {
        if (res.success) {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              subTitle: '取消工单成功',
            }
          })
          setTimeout(() => {
            self.setState({
              modelProps: {
                isOpen: false,
                title: '提示',
                subTitle: '取消工单成功',
              }
            })
            self.loadData();
          }, 1000);
        } else {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              role: 'alert',
              subTitle: res.msg,
            }
          })
        }
      }, (e) => {
        self.setState({
          modelProps: {
            isOpen: true,
            title: '提示',
            role: 'alert',
            subTitle: e.msg,
          }
        })
      })
    }

  }
  handleLockOrder(isOpen){
    let self = this;
    if (isOpen){
      this.setState({
        modelProps: {
          isOpen: true,
          title: '提示',
          role: 'confirm',
          subTitle: '是否终止服务',
        }
      })
    }else {
      this.setState({
        modelProps: {
          isOpen: true,
          title: '终止服务...',
          role: 'loading',
          subTitle: '',
        }
      })
      let id = this.props.location.query.id;
      Api.GET(Api.url(`/owner/serviceOrder/${id}/ownerLockOrder.jhtml`),{
        id: id,
        operator: Api.fetctUserInfo().ownerId
      },(res)=>{
        if (res.success) {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              subTitle: '终止服务成功',
            }
          })
          setTimeout(() => {
            self.setState({
              modelProps: {
                isOpen: false,
                title: '提示',
                subTitle: '终止服务成功',
              }
            })
            self.loadData();
          }, 1000);
        } else {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              role: 'alert',
              subTitle: res.msg,
            }
          })
        }
      },(e)=>{
        self.setState({
          modelProps: {
            isOpen: true,
            title: '提示',
            role: 'alert',
            subTitle: e.msg,
          }
        })
      })
    }

  }
  confirmOrder(isOpen) {
    let self = this;
    if (isOpen) {
      this.setState({
        modelProps: {
          isOpen: true,
          title: '提示',
          role: 'confirm',
          subTitle: '是否确认工单',
        }
      })
    } else {
      this.setState({
        modelProps: {
          isOpen: true,
          title: '提示',
          role: 'loading',
          subTitle: '',
        }
      })
      Api.GET(Api.url(`/owner/serviceOrder/${this.props.location.query.id}/confirmOrder.jhtml`), {
        id: this.props.location.query.id,
        operator: Api.fetctUserInfo().ownerId
      }, (res) => {
        if (res.success) {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              subTitle: '确认工单成功',
            }
          })
          setTimeout(() => {
            self.setState({
              modelProps: {
                isOpen: false,
                title: '提示',
                subTitle: '确认工单成功',
              }
            })
            self.loadData();
          }, 1000);
        } else {
          self.setState({
            modelProps: {
              isOpen: true,
              title: '提示',
              role: 'alert',
              subTitle: res.msg,
            }
          })
        }
      }, (e) => {
        self.setState({
          modelProps: {
            isOpen: true,
            title: '提示',
            role: 'alert',
            subTitle: e.msg,
          }
        })
      })
    }
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
      case "ownerlocked":
        return 3;
      case  'confirmed':
        return 3;
      case 'balanced':
        return 4;
      case 'completed':
        return 4;
      default:
        return -1;
    }
  }

  handleModelAction(action) {
    const {orderDetail, modelProps} = this.state;
    if (modelProps.role == 'confirm' && action) {
      switch (orderDetail.orderStatusCode) {
        case 'created':
          this.cancelOrder(false);
          break;
        case  'recepted':
          this.cancelOrder(false);
          break;
        case 'repairing':
          // this.cancelOrder(false);
          this.handleLockOrder(false);
          // this.onBridgeReady().bind(this)
          break;
        case 'confirmed':
          this.cancelOrder(false);
          break;
        case 'waitConfirm':
          this.confirmOrder(false);
          break;
        case 'balanced', 'completed':
          break;
        default:
          break;
      }
    } else {
      this.setState({
        modelProps: {
          isOpen: false,
        }
      })
    }

  }


  createHeader(orderDetail) {
    console.log(window.innerWidth)
    let flowIndex = this.handleflowState(orderDetail.beforeCancelStatus ? orderDetail.beforeCancelStatus : orderDetail.orderStatusCode);
    let status = this.handleflowState(orderDetail.orderStatusCode);
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
          status <= 3 && status != -1 && orderDetail.orderStatusCode != "ownerlocked" ? <button onClick={ this.cancelOrder.bind(this, true)
          }>{`${status == 3 ? '终止服务' : '取消订单'}`}</button> : null
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
                    return (<div className="order-details-service-item" key={index}>
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
              <p className="order-details-service-item-header">零配件</p>
              {
                parts.map((item, index) => {
                  return <div className="order-details-service-item-part" key={index}>
                    <div className="order-details-service-item-img">
                      <img src={item.image}/>
                    </div>
                    <div className="order-details-service-item-part-name">
                      {item.name}
                      {
                        item.xxCode ? <a className="order-details-service-item-part-xiu">修</a> : null
                      }
                    </div>
                    <div className="order-details-service-item-part-count">
                      <p className="order-details-service-item-part-totalPrice">{`¥${item.totalPrice}`}</p>
                      <p
                        className="order-details-service-item-part-quantity">{`x${item.quantity}${item.measureUnit}`}</p>
                    </div>
                  </div>
                })
              }
              <div className="order-details-service-items-footer">
                <p>小计</p>
                <p>{`¥${partsTotalPrice}`}</p>
              </div>
            </div> : null
          }
          <div className="order-details-section"></div>
        </div> : null
      }

    </div>);
  }

  createButton(orderDetail) {
    var buttonValue = "";
    switch (orderDetail.orderStatusCode) {
      case 'created':
        break;
      case 'recepted':
        break;
      case 'waitConfirm':
        buttonValue = "确定项目及配件";
        break;
      case 'repairing':
        break;
      case 'balanced':
        buttonValue = "支付";
        break;
      case 'completed':
        buttonValue = "立即评价";
        break;
      default:
        break;
    }
    let hidden = buttonValue.length > 0 && orderDetail.beforeCancelStatus == null;
    return (
      hidden ?
        <input className="order-details-button"
               onClick={this.handleClickBottomButton.bind(this, buttonValue)} value={buttonValue} type="button"/> : null
    );
  }


  render() {
    const {orderDetail, modelProps} = this.state;
    return (<Container className="order-details-body" scrollable>
      <Modal {...modelProps} onAction={this.handleModelAction.bind(this)}>
        {
          modelProps.subTitle && modelProps.subTitle.length > 0 ?
            <p className="order-details-model-subtitle">{modelProps.subTitle}</p> : null
        }
      </Modal>
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
              {
                this.createButton(orderDetail)
              }
            </List>

          </div>)
          :
          null
      }
    </Container>);
  }
}
