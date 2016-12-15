/**
 * Created by xiucheren on 16/12/14.
 */
import React from  'react';
import '../../style/vehiclenumberpre.scss';
const buttons = ["京","津","冀","晋","蒙","辽","吉","黑","沪","苏","浙","皖","闽","赣","鲁","豫","鄂","湘","粤","桂","琼","川","贵","云","渝","藏","陕","甘","青","宁","新"];
export default class VehicleNumberPre extends React.Component{
  componentDidMount(){
    $('.vehicleNumberpre-body').css('display','none');
  }
  componentWillReceiveProps(props) {
    // $('.vehicleNumberpre-body').css('display',props.isOpen ? 'block':'none')
    if (props.isOpen){
      $('.vehicleNumberpre-body').css('display','block')
      $('.vehicleNumberpre-body-con').css('bottom',`${-$('.vehicleNumberpre-body-con').height()}px`)
      $('.vehicleNumberpre-body-con').animate({bottom:'0px'},300)
    }else {
      $('.vehicleNumberpre-body-con').animate({bottom:`${-$('.vehicleNumberpre-body-con').height()}px`},300,()=>{
        $('.vehicleNumberpre-body').css('display','none')
      })

    }
  }
  render(){
    return (<div className="vehicleNumberpre-body">
      <div className="vehicleNumberpre-body-con">
        {
          buttons.map((item,index)=>{
            return (<input type="button" value={item} key={index} onClick={()=>{
              if (this.props.onSelect){
                this.props.onSelect(item)
              }
            }}/>);
          })
        }
      </div>
    </div>);
  }
}
