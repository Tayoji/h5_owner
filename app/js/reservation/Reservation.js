/**
 * Created by xiucheren on 16/12/9.
 */

import React from  'react';
import {
  Container,
  Group,
  List,
  Button
}from 'amazeui-touch';
import{
  Link
} from 'react-router';
import '../../style/app.scss';
import ChooseVehicle from './ChooseVehicle'
require('../../style/reservation.scss');
import{
  createStore
} from 'redux';
import {
  hashHistory
} from 'react-router'
export default class Reservation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      vehicleInfo:null,
      transition:'rfr'
    };
  }
  componentDidMount(){
    document.title = "预约";
    let vehicleinfo = window.sessionStorage.getItem('vehicleinfo')
    if (vehicleinfo){
      this.setState({
        vehicleInfo:JSON.parse(vehicleinfo),
      })
      window.sessionStorage.removeItem('vehicleinfo');
    }
  }


  render(){
    const {vehicleInfo} = this.state;
    return (<Container transition={this.state.transition}
                       scrollable >
      <Group noPadded>
        <List>
          <List.Item title = "车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辆" linkComponent={Link}
                     linkProps={{to: {pathname: '/owner/choosevehicle'}}}
                     after={vehicleInfo ? vehicleInfo.name: null}
          />
          <List.Item title = "服务种类" linkComponent={Link}/>
          <List.Item title = "行驶里程"  after={<input placeholder="输入行驶里程"/>}/>
        </List>
      </Group>
      <Group noPadded>
        <List>
          <List.Item title = "车&nbsp;&nbsp;牌&nbsp;&nbsp;号" after={<input className="" placeholder="请填写车牌号"/>}/>
          <List.Item title = "到店时间" linkComponent={Link}/>
        </List>
      </Group>
      <Button amStyle="alert" style={{width:'calc(100% - 30px)',margin:'15px',borderRadius:'5px'}} onClick={()=>{
        hashHistory.goBack();
        {/*hashHistory.pop()*/}

      }}>立即预约</Button>
    </Container>);
  }
}
