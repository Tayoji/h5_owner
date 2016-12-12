/**
 * Created by xiucheren on 16/11/30.
 */
import React from 'react';
import {
  Container,
} from 'amazeui-touch';
// import '../../style/MerchantsItem.scss';
require('../../style/MerchantsItem.scss');
import Star from  '../star/star'

export default class MerchantsItem extends React.Component {
  render() {
    let {model,index}= this.props;// toFixed
    var distance = "0m";
    if (model.distance < 1000){
      distance = `${model.distance}m`
    }else if(model.distance >=1000 && model.distance <=100*1000){
      distance = `${(model.distance/1000).toFixed(1)}km`
    }else {
      distance = `>100km`
    }
    return (
      <div className="merchants-item-con">
        <div className="merchants-item-imgs">
          <img className="merchants-item-imgs-icon" src='../i/isUnionMember.png'/>
          <img className="merchants-item-imgs-shop" src={model.imageUrl}/>
        </div>
        <div className="merchants-item-info">
          <p className="merchants-item-info-name">{model.name}</p>
          <p className="merchants-item-info-viewCount">{"浏览"+model.viewCount+"次"}</p>
          <div className="merchants-item-info-1">
            <div>
                <div className="merchants-item-categorieAbbrs">
                  {
                    model.categorieAbbrs.map((item,index)=>{
                        return (<p key={index} className="merchants-item-categorieAbbr" style={{backgroundColor:item.color}}>{item.abbr}</p>)
                    })
                  }
                </div>
                <div className="merchants-item-percentageandreviewCount">
                  <Star r={6} index={index} percentage={model.reviewScore/5}/>
                  <p className="merchants-item-reviewCount">{model.reviewCount + "人评价"}</p>
                </div>
            </div>
          </div>
          <div className="merchants-item-location">
            <p className="merchants-item-address">{model.address}</p>
            <p className="merchants-item-distance">{distance}</p>
          </div>
          <div className="merchants-item-buttoms">
            <div className="merchants-item-buttom">
              <img className="merchants-item-buttom-img" src='../i/insurance.png'/>
              <p className="merchants-item-buttom-text">{['1000', '2000', '5000', '2万', '5万', '10万', '20万'][model.insurance]}</p>
            </div>
            <div className="merchants-item-buttom" hidden={!model.isRentShop}>
              <img className="merchants-item-buttom-img" src='../i/isRentShop.png'/>
              <p className="merchants-item-buttom-text">分时租赁站</p>
            </div>
          </div>

        </div>
        <div className="merchants-item-line"></div>

      </div>
    );
  }

}
