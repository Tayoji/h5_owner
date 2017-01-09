/**
 * Created by xiucheren on 2017/1/6.
 */
import React from 'react';
export default class Root extends React.Component{
  render(){
    return (<div>{this.props.children}</div>)
  }
}
