/**
 * Created by xiucheren on 16/12/1.
 */

import React from 'react';
export default class Star extends React.Component{
  componentDidMount(){
    let key = this.props.index;
    var after = document.getElementById("star_after_"+key),
     before = document.getElementById("star_before_"+key),
     cxt1 = after.getContext('2d'),
     cxt2 = before.getContext('2d'),
     r = 6;
    if (this.props.r){
      r = this.props.r
    }
    for (var i = 0;i<5;i++){
      this.drawStar(cxt1,r,r*(2*i+1),r,"#999");
      this.drawStar(cxt2,r,r*(2*i+1),r,"#ff9900");
    }
  }
  drawStar(context, r, x, y,color) {
    context.lineWidth = 0.1;
    context.beginPath();
    var start = Math.PI /2 - Math.PI / 5 ;
    var dit = Math.PI * 4 / 5;
    var sin = Math.sin(start) * r + y;
    var cos = Math.cos(start) * r + x;
    context.moveTo(cos, sin);
    for (var i = 0; i < 5; i++) {
      var tempDit = dit * i + start;
      sin = Math.sin(tempDit) * r + y;
      cos = Math.cos(tempDit) * r + x;
      context.lineTo(cos, sin);
    }
    context.closePath();
    context.strokeStyle = "red";
    context.fillStyle = color;
    context.fill();
  }
  render(){
    let {index,percentage,r} = this.props;
    let width = r*10;
    let heigth = 2*r;
    return(<div>
      <canvas id={"star_after_"+index} width={width+'px'} height={width+'px'} style={{position:'absolute'}}></canvas>
      <canvas id={"star_before_"+index} width={percentage*width +"px"} height={width+'px'} style={{position:'absolute'}}></canvas>
    </div>);
  }

}
