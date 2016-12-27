/**
 * Created by xiucheren on 16/12/9.
 */

import React from  'react';
import {
  Container,
  Group,
  List,
  Button,
  Icon,
  Modal
}from 'amazeui-touch';
import{
  Link
} from 'react-router';
import VehicleNumberPre from './VehicleNumberPre';
import '../../style/app.scss';
import DatePicker from 'react-mobile-datepicker';
import HourMinPicker from '../datepicker/DatePicker';
import ChooseVehicle from './ChooseVehicle'
var Tools = require('../Tools/Tools');
var Api = require('../Tools/Api');
require('../../style/reservation.scss');

import {
  hashHistory
} from 'react-router'
export default class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      VehicleNumberPreIsOpen:false,
      vehicleName: '豫',
      modalProps: {
        role: 'loading',
        title: '',
        isOpen: false
      },
      vehicleInfo: null,
      transition: 'rfr',
      servicecategorys: [],
      datePickerModel: {
        isOpen: false,
        dateFormat: ['YYYY', 'M', 'D'],
        theme: 'ios',
      },
      hourMinPicker: {
        isOpen: false,
        date: null,
      },
      date: null,

    };
  }

  componentDidMount() {
    document.title = "预约";
    let vehicleinfo = window.sessionStorage.getItem('vehicleinfo');
    let servicecategorys = window.sessionStorage.getItem('servicecategorys');
    if (vehicleinfo) {
      this.setState({
        vehicleInfo: JSON.parse(vehicleinfo),
      })
      // window.sessionStorage.removeItem('vehicleinfo');
    }
    if (servicecategorys) {
      this.setState({
        servicecategorys: JSON.parse(servicecategorys),
      })
      // window.sessionStorage.removeItem('servicecategorys');
    }
  }

  handerDatePicker(e) {
    var date = new Date();
    e.setHours(date.getHours())
    e.setMinutes(date.getMinutes())
    this.setState({

      datePickerModel: {
        isOpen: false,
      },
      hourMinPicker: {
        isOpen: true,
        date: e
      },

    });
  }

  createReservation() {
    const {vehicleInfo, servicecategorys, datePickerModel, hourMinPicker, date, modalProps, vehicleName} = this.state;
    if (!vehicleInfo) {
      this.setState({
        modalProps:{
          role:'alert',
          title:'没有选择车型',
          isOpen:true,
        }
      })
      return;
    }
    if (servicecategorys.length == 0){
      this.setState({
        modalProps:{
          role:'alert',
          title:'没有选择服务种类',
          isOpen:true,
        }
      })
      return;
    }
    let mileage =  $('#reservation-mileage').val();
    if (mileage.length == 0){
      this.setState({
        modalProps:{
          role:'alert',
          title:'请输入里程数',
          isOpen:true,
        }
      })
      return;
    }
    let cardnum = $('#reservation-cardnum').val();
    if(cardnum.length == 0){
      this.setState({
        modalProps:{
          role:'alert',
          title:'请输入车牌号',
          isOpen:true,
        }
      })
      return;
    }
    let dateStr = $('.reservation-date').text();
    if(dateStr.length == 0){
      this.setState({
        modalProps:{
          role:'alert',
          title:'请选择选择到店时间',
          isOpen:true,
        }
      })
      return;
    }
    this.setState({
      modalProps:{
        role:'loading',
        title:'预约中...',
        isOpen:true,
      }
    })
    let self = this;
    Api.POST('http://192.168.1.12:8080/api/owner/reservation/create.jhtml', {
      serviceShopId: this.props.location.query.serviceShopId,
      ownerId: Api.fetctUserInfo().ownerId,
      vehicleId: this.state.vehicleInfo.id,
      vehicleNumber:`${vehicleName}${cardnum}`,
      serviceCategorys:servicecategorys.join('、'),
      vehicleMileage:mileage,
      reservationDate:dateStr
    },(res)=>{
      //
      if (res.success){
        self.setState({
          modalProps:{
            role:'loading',
            title:res.data.reservationStatus.orderStatusName,
            isOpen:false,
          }
        })
        hashHistory.push({
          pathname:'/owner/reservation/details',
          query:{
            id:res.data.reservationStatus.id
          }
        })
      }else {
        self.setState({
          modalProps:{
            role:'alert',
            title:res.msg,
            isOpen:true,
          }
        })
      }
    },(e)=>{
      self.setState({
        modalProps:{
          role:'alert',
          title:e.msg,
          isOpen:true,
        }
      })
    })
  }

  render() {
    const {vehicleInfo, servicecategorys, datePickerModel, hourMinPicker, date, modalProps, vehicleName,VehicleNumberPreIsOpen} = this.state;
    return (<Container transition={this.state.transition}
                       scrollable
                       className = "reservation-body"
    >
      <Group noPadded>
        <VehicleNumberPre isOpen={VehicleNumberPreIsOpen} onSelect = {(e)=>{
            this.setState({
              vehicleName:e,
              VehicleNumberPreIsOpen:false
            })
        }}/>
        {/*
         年月日 选择器
         */}
        <DatePicker {...datePickerModel} onSelect={this.handerDatePicker.bind(this)} onCancel={() => {
          this.setState({
            datePickerModel: {
              isOpen: false
            }
          })
        }}/>
        {/*
         模态框
         */}
        <Modal {...modalProps} onDismiss={
          () => {
            // model 点击 上面的x
            this.setState({
              modalProps: {
                isOpen: false,
              }
            })
          }
        } onAction={(e) => {
          // model 点击 确定或者 取消按钮
          this.setState({
            modalProps: {
              isOpen: false,
            }
          })
        }}/>
        {/*
         小时 分钟 选择器
         */}
        <HourMinPicker {...hourMinPicker} onSelect={(e) => {
          console.log(e);
          this.setState({
            date: e,
            hourMinPicker: {
              isOpen: false
            }
          });
        }
        }/>
        <List>
          <List.Item title="车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辆" linkComponent={Link} className = "reservation-servicecategorys"
                     linkProps={{to: {pathname: '/owner/choosevehicle'}}}
                     after={vehicleInfo ? vehicleInfo.name : null}
          />
          <List.Item title="服务种类" linkComponent={Link} className = "reservation-servicecategorys"
                     linkProps={{to: {pathname: '/owner/servicecategorys'}}}
                     after={servicecategorys.join(',')}
          />
          <List.Item className="reservation-li" title="行驶里程" after={<input style={{borderStyle:"none"}} className="reservation-input" id="reservation-mileage"  placeholder="输入行驶里程"/>}/>
        </List>
      </Group>
      <Group noPadded>
        <List>
          <List.Item title="车&nbsp;&nbsp;牌&nbsp;&nbsp;号"
                     after={<div className="reservation-vehicle">
                       <div className="reservation-vehicle-card" onClick={(e)=>{
                         this.setState({
                           VehicleNumberPreIsOpen:true,
                         })
                       }}>
                         <Icon name="caret" className="vehicle-icon"/>
                         <p>{vehicleName}</p>
                       </div>
                       <input className="reservation-input" id="reservation-cardnum" placeholder="请填写车牌号"/>
                     </div>}/>
          <List.Item title="到店时间"
                     linkComponent={Link}
                     after={date ? <p className="reservation-date">{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 1} ${date.getHours() < 10 ? `0${date.getHours()}`: date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`}</p> : ''}
                     onClick={() => {
                       this.setState({
                         hourMinPicker: {
                           isOpen: false,
                         },
                         datePickerModel: {
                           isOpen: true,
                           dateFormat: ['YYYY', 'M', 'D'],
                           theme: 'ios',
                         },

                       });
                     }}/>
        </List>
      </Group>
      <Button amStyle="alert" style={{width: 'calc(100% - 30px)', margin: '15px', borderRadius: '5px'}}
              onClick={this.createReservation.bind(this)}>立即预约</Button>
    </Container>);
  }
}
