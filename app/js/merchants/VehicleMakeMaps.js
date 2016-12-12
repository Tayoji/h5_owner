/**
 * Created by xiucheren on 16/12/3.
 */
import React from 'react';
import {
  Container
}from 'amazeui-touch';
// import '../../style/vehiclemakemaps.scss'
require('../../style/vehiclemakemaps.scss');
export default class VehicleMakeMaps extends React.Component{
  render(){

    let list = JSON.parse(this.props.location.query.list);
    return (
      <Container
        transition={'sfr'}
        style={{overflowY:'scroll',backgroundColor:'#fff'}}>
        {
          list ? (<div className="vehiclemakemaps-items">
              {
                list.map((item,index)=>{
                  return (<div key={index} className="vehiclemakemaps-item" >
                    <img src={item.vehicleMakeLogo}/>
                    <p>{item.vehicleMakeName}</p>
                  </div>)
                })
              }
            </div>

          ) : null
        }
      </Container>


    );
  }
}
