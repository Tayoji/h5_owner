/**
 * Created by xiucheren on 16/11/30.
 */
import React from 'react';
import {
  Container,
  List
} from 'amazeui-touch';
import{
  hashHistory
} from 'react-router';
import SearchBar from '../Tools/SearchBar'
import ReactIScroll from 'reactjs-iscroll';
import iScroll from 'iscroll/build/iscroll-probe';
import MerchantsItem from './MerchantsItem';
// import '../../style/Merchants.scss';
require( '../../style/Merchants.scss');
var Api = require('../Tools/Api')
export default class Merchants extends React.Component{
  constructor(props){
    super(props);
    this.loadData.bind(this);
    this.handleChange.bind(this);
    this.state = {
      keyword:'',
      pageNo:1,
      shopList:[],
      address: {
        coords:null,
      },
      options:[{
        name:"全部服务",
        id:'all'
      },{
        name:"全城",
        id:'-1'
      },{
        name:"综合排序",
        id:'all',
      },{
        name:'筛选',
      }],
      position:{
        point:{
          lng:113.64964385,
          lat:34.75661006
        }
      }
    }
  }


  componentDidMount(){
    let self = this;
    document.title="商家列表"
    self.loadData();
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
      if(this.getStatus() == BMAP_STATUS_SUCCESS){
        self.setState({
          position:r
        });
        // self.loadData();
      }
      else {
        alert('failed'+this.getStatus());
      }
    });
  }

  loadData(){
    let self = this;
    var parms = {
      "category": "all",
      "orderType": "default",
      "pageNo": this.state.pageNo,
      "cityCode": 268,
      "areaCode": -1,
      "insuranceLevel": 1,
      "shopType": ""
    }
    if (this.state.position){
      parms.mapCoordinates = this.state.position.point.lng + "," +  this.state.position.point.lat;
    }
    if (this.state.keyword){
      parms.keyword = this.state.keyword;
    }
    Api.POST(Api.url("/owner/serviceShop/list.jhtml"), parms, (res) => {
      self.setState({
        shopList: res.data.shopList,
      });
    }, (e) => {

    })
  }
  // handleclickSearchBar(){
  //   $('.merchants-searbar-input').focus()
  // }
  // handleFocus(e){
  //   console.log(e)
  // }
  handleChange(e){
    let self = this;
    this.setState({
      keyword:e
    })
    this.loadData()

  }
  handleBlur(e){

  }
  render(){
    let {position} = this.state;
     return (<Container>
       <div className="merchants-header">
          <SearchBar height = "44px" onChange={this.handleChange.bind(this)}/>
         <div className="merchants-options">
           {
             this.state.options.map((item,index)=> {
               return (<div className="merchants-option" style={{borderColor:(index == 3 ? "#fff":null)}} key={index}>
                  <div>
                    <p>{item.name}</p>
                    <img src="../i/down.png"/>
                  </div>
               </div>)
             })
           }
         </div>
       </div>

       <div className="merchants-con">

         <ReactIScroll
           iScroll={iScroll}
         >
           <div className ="merchants-address">
             <div>
               <p >{'当前地址:'+(position.address ? `${position.address.province}${position.address.city}${position.address.street}${position.address.street_number}` : "")}</p>
               <img src="../i/refresh.png"/>
             </div>
           </div>
           <ul className="merchants-list">
             {
               this.state.shopList.map((item,index)=>{
                 return (<li className="merchants-list-li" key={index} onClick={(e)=>{
                   hashHistory.push({
                     pathname:'/owner/serviceShop',
                     query:{
                       id:item.id
                     }
                   })
                 }}>
                   <MerchantsItem model={item} index={index} />
                 </li>);
               })
             }
           </ul>
         </ReactIScroll>
       </div>


     </Container>);
    }

}
