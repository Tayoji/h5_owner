/**
 * Created by xiucheren on 16/12/5.
 */

import React from 'react';
import {
  Container,
  Group
}from 'amazeui-touch';
import '../../style/shopinfo.scss'
var Api = require('../Tools/Api')
export default class ShopInfo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      shopInfo:[],
      transition:'sfr'
    };
  }
  componentDidMount(){
    let id = this.props.location.query.id;
    let self = this;
    Api.POST(Api.url(`/owner/serviceShop/${id}/shopInfo.jhtml`),null,(res)=>{
      console.log(res);
      var shopinfo = new Array();
      if (res.data.shopInfo){
        let item = {
          name:'综合实力',
          value:[res.data.shopInfo[0],res.data.shopInfo[6]]
        }
        shopinfo.push(res.data.shopInfo[4]);
        shopinfo.push(item);
        shopinfo.push(res.data.shopInfo[3]);
        self.setState({
          shopInfo:shopinfo
        });
      }
    },(e)=>{

    });
  }
  componentWillUnMount(){
    console.log('ssf')
    this.setState({
      transition:'sfl',
    });
  }
  configurationview(index,item){
    if (index === 0){
      return (<p className="shopinfo-p-text">{item.value ? item.value :'暂无'}</p>);
    }else if(index===1){
      return (item.value.map((info,i)=>{
        return (<div>
          <p className="shopinfo-p-header">{info.name}</p>
          <p className="shopinfo-p-text">{info.value}</p>
        </div>)
      }));
    }else {
      var texts = item.value.split(' ');
      return (
        <div style={{height:'30px'}}>
          {
            texts.map((text,i)=>{
              return (text ?
                <div className="serviceShop-serviceFacility" key={i}
                >            <img src={`../i/${text}.png`}/>
                  <p className="shopinfo-p-text">{text}</p>
                </div>
                : null)
            })
          }
        </div>
      );

    }
  }

  render(){
    return (<Container
            transition={this.state.transition}
            style={{marginTop:"-30px"}}
    >
      {
        this.state.shopInfo.map((item,index)=>{
          return (<Group header={item.name} key={index}>
            {
              this.configurationview(index,item)
            }
          </Group>);
        })
      }


    </Container>);
  }
}
