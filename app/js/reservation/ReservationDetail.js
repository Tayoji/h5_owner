/**
 * Created by xiucheren on 16/12/13.
 */
import React from 'react';
import {
  Container,
  Group,
  List
}from 'amazeui-touch';
import '../../style/reservationdetail.scss';
var Api = require('../Tools/Api');
export default class ReservationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount() {
    let self = this;
    Api.GET(Api.url(`/owner/reservation/${this.props.location.query.id}.jhtml`), null, (res) => {
      console.log(res);
      if (res.success) {
        self.setState({
          data: res.data.reservationStatus
        });
      } else {

      }
    }, (e) => {

    })

  }

  createView(data) {
    var imgUrl = "../i/reservation-failure.png";
    if (data) {
      switch (data.reservationStatusCode) {
        case 'waitConfirm':
          imgUrl = "../i/reservation-waitConfirm.png"
          break;
        case 'cancel':
          imgUrl = '../i/reservation-cancel.png';
          break;
        case 'success':
          imgUrl = '../i/reservation-success.png';
          break;
        case 'close':
          break;
        case 'ordered':
          break;
        case 'failure':
          imgUrl = '../i/reservation-failure.png';
          break;
      }
    }
    const titles = [{
      name: '服务项目',
      value: data ? data.serviceCategory : ""
    }, {
      name: '汽  修  站',
      value: data ? data.serviceShopName : ""
    }, {
      name: '期望时间',
      value: data ? data.reservationDate : ""
    }];
    let top = `${-window.innerWidth / 720.0 * 196 / 2 - 10}px`;
    return ( data ?
      (<div>
        <Group noPadded>
          <div className="reservation-detail-header">
            <img src={imgUrl}/>
            <p style={{top: top}}>{data.reservationStatusName}</p>
          </div>
          <div className="reservation-detail-info">
            {
              titles.map((item, index) => {
                console.log(item.value);
                return (<div key={index}>
                  <p className="reservation-detail-info-title">{item.name}</p>
                  <p className="reservation-detail-info-value">{item.value}</p>
                </div>)
              })
            }
          </div>
        </Group>
        <Group noPadded>
          <List>
            <List.Item title="车辆描述"/>
            <List.Item subTitle={data.memo ? data.memo : '暂无信息'}/>
          </List>
        </Group>
      </div>) : null)
  }

  render() {
    const {data} = this.state;
    return (<Container>
      {
        this.createView(data)
      }
    </Container>)
  }
}
