/**
 * Created by xiucheren on 16/12/12.
 */
import React from 'react';
import {
  hashHistory
}from 'react-router';
import{
  Container,
  Button,
} from 'amazeui-touch';
import '../../style/servicecategorys.scss';
var Api = require('../Tools/Api');
const buttons = ["洗车","保养" ,"维修" ,"钣金喷漆" ,"美容装饰" ,"轮胎轮毂" ,"加装改装","道路救援"];
export default class ServiceCategorys extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      servicecategorys:[],
    }
  }
  componentDidMount(){
    Api.setTitle("选择服务项目");

  }
  render() {
    var servicecategorys = this.state.servicecategorys;
    return (<Container>
      <div className="servicecategorys-buttons">
        {
          buttons.map((item,index)=>{
            return (<input className={`servicecategorys-button${servicecategorys.indexOf(item) > -1 ? "-selected" : "" }`}
                           type="button" value={item}
                           key={index}
                           onClick={()=>{
                             let i = servicecategorys.indexOf(item);
                             console.log("------",servicecategorys)
                             if (i > -1){
                               servicecategorys.splice(i,1);
                             }else{
                               servicecategorys.push(item);
                             }
                             console.log("+++++",servicecategorys)

                             this.setState({
                               servicecategorys:servicecategorys
                             });
                           }}/> );
          })
        }
      </div>
      <Button amStyle="alert" style={{width:'calc(100% - 30px)',margin:'15px',borderRadius:'5px'}} onClick={()=>{
        window.sessionStorage.setItem('servicecategorys',JSON.stringify(this.state.servicecategorys))
        hashHistory.goBack();

      }}>确定</Button>
    </Container>);
  }
}
