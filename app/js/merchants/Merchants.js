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
import MerchantsSelector from './MerchantsSelector';
// import '../../style/Merchants.scss';
require('../../style/Merchants.scss');
var Api = require('../Tools/Api')
export default class Merchants extends React.Component {
  constructor(props) {
    super(props);
    this.loadData.bind(this);
    this.handleChange.bind(this);
    this.updataGeolocation.bind(this);
    this.rotating.bind(this);
    this.state = {
      keyword: '',
      pullUpState: false,
      pageNo: 1,
      selectorIndex: -1,
      shopList: [],
      address: {
        coords: null,
      },
      merchantsoptions: [{
        name: "全部服务",
        value: 'all',
        type: 'services'
      }, {
        name: "全城",
        value: '-1',
        type: 'city',
      }, {
        name: "综合排序",
        value: 'default',
        type: 'sort',
      }, {
        name: '筛选',
        value: '',
        value1: '1',
        type: 'selector',

      }],
      position: {
        point: {
          lng: 113.64964385,
          lat: 34.75661006
        }
      }
    }
    this.parms = {
      "category": "all",
      "orderType": "default",
      "pageNo": 1,
      "cityCode": 268,
      "areaCode": -1,
      "insuranceLevel": 1,
      "shopType": ""
    };
    this.addressImgState = false;

  }


  componentDidMount() {
    Api.setTitle("商家列表")
    // transform:rotate
    let data = window.sessionStorage.getItem(this.props.location.key);
    if (!data) {
      this.updataGeolocation()
    } else {
      this.setState({...JSON.parse(data)})
    }
  }

  updataGeolocation() {
    let self = this;
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      self.rotating(true);
      self.setState({
        position: r
      });
      let scroll = self.refs.merchantsrefresh;
      scroll.setState({
        pullDownState: 2,
        pullDownCls: 'iscroll-loading'
      });
      self.parms.pageNo = 1;
      var callback = function () {
        setTimeout(() => {
          scroll.setState({
            pullUpState: 0,
            isScrolling: false
          }, () => {
            scroll.lock = false;
            scroll.iScrollInstance.refresh();
          });
        }, 200);
      }

      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        self.loadData(callback)
      }
      else {
        alert("定位失败,将定位至河南郑州市")
        self.setData({
          position: {
            point: {
              lng: 113.64964385,
              lat: 34.75661006
            },
            address: nil
          }
        })
        self.loadData(callback)
      }
    });

  }

  componentWillUnmount() {

    if (this.state.position.address) {
      window.sessionStorage.setItem(this.props.location.key, JSON.stringify(this.state));
    } else {
      window.sessionStorage.removeItem(this.props.location.key)
    }
    if (this.rotatingTimer) {
      clearInterval(this.rotatingTimer);
    }
  }

  loadData(callback) {
    let self = this;
    if (this.state.position) {
      this.parms.mapCoordinates = this.state.position.point.lng + "," + this.state.position.point.lat;
    }
    if (this.state.keyword) {
      this.parms.keyword = this.state.keyword;
    }
    Api.POST(Api.url("/owner/serviceShop/list.jhtml"), this.parms, (res) => {
      if (res.success) {
        var shopList = self.state.shopList;
        if (self.parms.pageNo == 1) {
          shopList = res.data.shopList;
        } else {
          shopList = shopList.concat(res.data.shopList);
        }
        self.setState({
          shopList: shopList,
          pullUpState: res.data.shopList.length >= 20
        });

      }

      if (callback) {
        callback();
      }
    }, (e) => {
      if (callback) {
        callback();
      }
    })
  }

  rotating(state) {
    this.addressImgState = !state;
    if (this.addressImgState) {
      var deg = 0;
      this.updataGeolocation()
      if (this.rotatingTimer) {
        clearInterval(this.rotatingTimer);
      }
      this.rotatingTimer = setInterval(() => {
        deg += 10;
        $('.merchants-address-refresh').css("transform", `rotate(${deg}deg)`)
      }, 50)
    } else {
      if (this.rotatingTimer) {
        clearInterval(this.rotatingTimer);
      }
      $('.merchants-address-refresh').css("transform", `rotate(${deg}deg)`)
    }

  }

  handleRefresh(upordown, callback) {
    if (callback && typeof callback === 'function') {

      if (upordown == 'up') {
        this.parms.pageNo++;
      } else {
        this.parms.pageNo = 1;
      }
      this.loadData(callback);
    }
  }

  handleChange(e) {
    let self = this;
    if (this.keywordTimer) {
      clearTimeout(this.keywordTimer)
    }
    this.keywordTimer = setTimeout(() => {
      self.setState({
        keyword: e
      })
      self.parms.pageNo = 1;
      self.loadData()
      clearTimeout(self.keywordTimer)
    }, 1000);

  }

  handleBlur(e) {

  }

  handleSelector(index) {
    if (this.state.selectorIndex == index) {
      this.setState({
        selectorIndex: -1,
      })
    } else {
      this.setState({
        selectorIndex: index,
      })
    }
  }

  handlemerchantsSelector(option) {
    var merchantsoptions = this.state.merchantsoptions;
    merchantsoptions.map((item) => {
      if (item.type == option.type) {
        return option;
      } else {
        return item;
      }
    })
    switch (option.type) {
      case "services":
        this.parms.category = option.value
        break;
      case "city":
        this.parms.areaCode = option.value;
        break;
      case "sort":
        this.parms.orderType = option.value;
        break
      case 'selector':
        this.parms.shopType = option.value;
        if (option.value == "" || option.value == "traditionShop") {
          this.parms.insuranceLevel = option.value1;
        } else {
          this.parms.insuranceLevel = 1;
        }
        break
    }
    this.setState({
      merchantsoptions: merchantsoptions,
      selectorIndex: -1,
    })
    this.loadData();

  }

  render() {
    let {position, selectorIndex, merchantsoptions, pullUpState} = this.state;
    return (<Container>
      <div className="merchants-header">
        <SearchBar height="44px" onChange={this.handleChange.bind(this)}/>
        <MerchantsSelector option={selectorIndex != -1 ? merchantsoptions[selectorIndex] : null} onSelected={
          this.handlemerchantsSelector.bind(this)
        }/>
        <div className="merchants-options">
          {
            merchantsoptions.map((item, index) => {
              return (<div className="merchants-option" style={{borderColor: (index == 3 ? "#fff" : null)}} key={index}>
                <div className={`merchants-options-${index == selectorIndex ? "selected" : 'normal'}`}
                     onClick={this.handleSelector.bind(this, index)}
                >
                  <p>{item.name}</p>
                  <img src={`${index == selectorIndex ? "../i/up.png" : "../i/down.png"}`}/>
                </div>
              </div>)
            })
          }
        </div>
      </div>

      <div className="merchants-con">

        <ReactIScroll
          iScroll={iScroll}
          ref="merchantsrefresh"
          pullUp={pullUpState}
          handleRefresh={this.handleRefresh.bind(this)}
        >
          <div className="merchants-address">
            <div>
              <p >{'当前地址:' + (position.address ? `${position.address.province}${position.address.city}${position.address.street}${position.address.street_number}` : "河南郑州市")}</p>
              <img className="merchants-address-refresh" src="../i/refresh.png"
                   onClick={this.rotating.bind(this, this.addressImgState)}/>
            </div>
          </div>
          <ul className="merchants-list">
            {
              this.state.shopList.map((item, index) => {
                return (<li className="merchants-list-li" key={index} onClick={(e) => {
                  hashHistory.push({
                    pathname: '/owner/serviceShop',
                    query: {
                      id: item.id
                    }
                  })
                }}>
                  <MerchantsItem model={item} index={index}/>
                </li>);
              })
            }
          </ul>
        </ReactIScroll>
      </div>
    </Container>);
  }

}
