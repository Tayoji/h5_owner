/**
 * Created by xiucheren on 16/12/2.
 */

import React from 'react';
import {
  List,
  Container,
  Group,
  Slider,
  Button
} from 'amazeui-touch';
import {
  Link,
  hashHistory
} from 'react-router';
import '../../style/serviceshop.scss';
var Api = require('../Tools/Api');
import Star from '../star/star';
const insurances = ['1000', '2000', '5000', '20000', '50000', '100000', '200000'];
export default class ServiceShop extends React.Component {
  constructor(props) {
    super(props);
    this.loadData.bind(this);
    this.tryloadState();
  };

  tryloadState() {
    let state = window.sessionStorage.getItem(this.props.location.key);
    if (state) {
      state = JSON.parse(state);
      this.state = {
        data: state.data,
        transition: state.data ? 'rfl' : 'rfr'
      };
    } else {
      this.state = {
        data: null,
        transition: 'rfl'
      };
    }
  }

  componentDidMount() {
    Api.setTitle("商家详情")
    console.log(Api.fetctUserInfo());
    if (!this.state.data) {
      this.loadData();
    }
    // document.title = '商家详情';
    console.log(this.props.location.query)

  }

  componentWillUnmount() {
    window.sessionStorage.setItem(this.props.location.key, JSON.stringify(this.state));
  }

  loadData() {
    let self = this;
    Api.POST(Api.url(`/owner/serviceShop/${this.props.location.query.id}.jhtml`), null, (res) => {
      self.setState({
        data: res.data,
      });
    }, (e) => {

    })
  };

  render() {
    const {data} = this.state;
    const shop = data ? data.shop : null;
    var vehicleMakeMaps;
    if (data) {
      vehicleMakeMaps = JSON.stringify(data.shop.vehicleMakeMaps)
    }
    return (<Container
      transition={this.state.transition}
      style={{overflowY: 'scroll'}}>
      {
        data ? (
          <div>
            <div className="serviceshop-header">
              {/*<img className="serviceshop-header-img" src={data.images.length > 0 ? data.images[0].url : null }/>*/}
              <Slider className="serviceshop-header-img">
                {
                  data.images.map((item,index)=>{
                    return (<Slider.Item key = {index}>
                      <img src={item.url}/>
                    </Slider.Item>);
                  })
                }
              </Slider>
              <p className="serviceshop-header-imageCount">{`${shop.imageCount}张`}</p>
              <div className="serviceshop-header-info">
               <div className="serviceshop-header-info1">
                 <p className="serviceshop-header-info-shopname" style={{fontSize: '15px'}}>{data.shop.name}</p>
                 <p className="serviceshop-header-info-count">{`已服务${shop.serviceCount}次`}</p>
               </div>
               <div className="serviceshop-header-info2">
                 <div>
                   <div className="serviceshop-header-insurance">
                     <img src="../i/shop-insurance.png"/>
                     <p>{insurances[shop.insurance - 1]}</p>
                   </div>
                   <img src={`../i/zz${shop.qualification}.png`}/>
                 </div>
                 <p className="serviceshop-header-info-review">{`${shop.serviceReviewScore}分｜${shop.reviewCount}人点评`}</p>
               </div>
              </div>
            </div>
            {/**/}
            <Group noPadded>
              {
                data.shop.categories.length > 0 ? (
                  <List>
                    <List.Item title="业务范围"/>
                    <List.Item subTitle={data.shop.categories.join(' / ')}/>
                  </List>
                ) : null
              }
            </Group>
            <Group noPadded>
              {
                data.shop.vehicleMakes.length > 0 ? (
                  <List>
                    <List.Item title="主修品牌"
                               linkComponent={Link}
                               linkProps={{
                                 to: {
                                   pathname: '/owner/serviceShop/vehiclemakemaps',
                                   query: {list: vehicleMakeMaps}
                                 }
                               }}/>
                    <List.Item subTitle={data.shop.vehicleMakes.join(' / ')}/>
                  </List>
                ) : null
              }

            </Group>
            <Group noPadded>
              <List>
                <List.Item title="门店介绍"
                           linkComponent={Link}
                           linkProps={{to: {pathname: '/owner/serviceShop/shopinfo', query: {id: data.shop.id}}}}
                />
                <List.Item subTitle={data.shop.detail}>
                  <div>
                    {
                      data.shop.serviceFacility.map((item, index) => {
                        return (
                          <div className="serviceShop-serviceFacility" key={index}>
                            <img src={`../i/${item}.png`}/>
                            <p>{item}</p>
                          </div>
                        );
                      })
                    }
                  </div>
                </List.Item>
              </List>
            </Group>

            <Group noPadded>
              <List>
                <List.Item media={<img className="list-icon" src="../i/icon-review.png"/>} title="车主评价"
                           href={`http://m.xiucheren.net/owner/shop_reviews.html?serviceShopId=${data.shop.id}`}
                           after={<div className="serviceShop-star">
                             <p>{`${data.shop.reviewScore}分`}</p>
                             <Star percentage={data.shop.reviewScore / 5.0} index="serviceShop" r={6}/>
                           </div>}
                />
              </List>
            </Group>

            <Group noPadded>
              <List>
                <List.Item media={<img className="list-icon" src="../i/icon-address.png"/>} title={data.shop.address}
                           href={Api.markerLocation(data.shop.mapCoordinates.split(',')[1], data.shop.mapCoordinates.split(',')[0], data.shop.name, data.shop.address)}/>
                <List.Item media={<img className="list-icon" src="../i/icon-tel.png"/>} title={data.shop.telephone}
                           href={`tel://${data.shop.telephone}`}/>
                <List.Item media={<img className="list-icon" src="../i/icon-time.png"/>}
                           title={`营业时间：${data.shop.openingTime ? data.shop.openingTime : '00:00'}-${data.shop.closingTime ? data.shop.closingTime : '24:00'}`}/>
              </List>
            </Group>
            <Button amStyle="alert" style={{width: '100%'}} onClick={() => {
              if (Api.fetctUserInfo()) {
                hashHistory.push({
                  pathname: '/owner/reservation/createreservation',
                  query: {
                    serviceShopId: this.props.location.query.id
                  }
                })
              } else {
                hashHistory.push({
                  pathname: '/owner/login',
                })
              }

            }}>立即预约</Button>
          </div>) : null
      }
    </Container>);
  }

}
