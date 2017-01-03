/**
 * Created by xiucheren on 2016/12/28.
 */
import React from 'react';
import '../../i/star-grey@2x.png';
import '../../i/star-zc@2x.png';
import '../../i/review-add.png';
import '../../style/orderreview.scss';
export default class OrderReview extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      serviceScore:5,
      techScore:5,
      imgPaths:["../../i/review-add.png"],
    }
  }
  render(){
    let starGrey = '../../i/star-grey@2x.png';
    let starZc = '../../i/star-zc@2x.png';
    let arr = [1,2,3,4,5];
    const {serviceScore,techScore,imgPaths} = this.state;
    return (<div className = "order-review-body">
     <div className = "order-review-stars">
       <div className="order-review-star">
         <p>技能</p>
         {
           arr.map((item,index)=>{
             return (<input type="image" src={index <= serviceScore ? starZc : starGrey} key={index} onClick={()=>{
               this.setState({
                 serviceScore:index
             })
             }}/>)
           })
         }
       </div>

       <div className="order-review-star">
         <p>环境</p>

         {
           arr.map((item,index)=>{
             return (<input type="image" src={index <= techScore ? starZc : starGrey} key={index} onClick={()=>{
               this.setState({
                 techScore:index
               })
             }}/>)
           })
         }
       </div>
     </div>
      <div className="order-review-content">
        <textarea placeholder="说说你的服务感受吧!"></textarea>
        <div className="order-review-imgs">
          {
            imgPaths.map((path,index)=>{
             return ( <input alt={path} type="file" />)
            })
          }
        </div>
      </div>
      <button>评价</button>
    </div>)
  }
}
