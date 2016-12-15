/**
 * Created by xiucheren on 16/12/13.
 */
import React from 'react';
import {
  hashHistory,
  Link
}from 'react-router';
import {
  Container,
  Group,
  List
} from 'amazeui-touch';
import '../../style/ownerreservations.scss';
var Api = require('../Tools/Api');
export default class OwnerReservations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reservationList: [],
    }
  }

  componentDidMount() {
    let userinfo = Api.fetctUserInfo();
    let self = this;
    if (userinfo) {
      Api.GET(Api.url(`/owner/reservation/${userinfo.ownerId}/ownerReservations.jhtml`), null, (res) => {
        if (res.success) {
          self.setState({
            reservationList: res.data.reservationList
          })
        } else {

        }
      }, (e) => {

      })
    } else {

    }

  }

  handleReservationStatusColor(item, e) {
    var color = '#ff9900';
    switch (item.reservationStatusCode) {
      case 'success':
        color = '#ff9900';
        break;
      case 'reservationStatusCode':
        color = '#eb3341';
        break
      case 'waitConfirm':
        color = '#009900';
        break;
      case 'failure':
        color = '#eb3341';
        break;
      case 'close':
        color = '#eb3341';
        break;
      case 'cancel':
        color = '#333'
        break;
    }
    return (<p style={{color: color, fontSize: '15px'}}>{item.reservationStatusName}</p>)
  }

  render() {
    const {reservationList} = this.state;
    return (<Container scrollable>
      <Group noPadded>
        <List>
          {
            reservationList.map((item, index) => {
              var test = this.handleReservationStatusColor(item);
              return (
                <Link to={{pathname: '/owner/reservation/details',query:{id:item.id}}}>
                  <List.Item className="ownerReservations-li" title={item.serviceShopName}
                             after={test}
                             subTitle={`服务时间  ${item.reservationDate}`
                             }>
                    <p className="item-subtitle-2">{`期望项目  ${item.serviceCategory}`}</p>
                  </List.Item>
                </Link>);
            })
          }
        </List>
      </Group>
    </Container>);
  }
}

