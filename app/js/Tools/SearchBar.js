/**
 * Created by xiucheren on 16/12/1.
 */

import React from 'react';
import '../../style/searchbar.scss'
export default class SearchBar extends React.Component {
  static defaultProps = {
    width: "100%",
    height:'44px',
  };

  constructor(props){
    super(props);
    this.handleFocus.bind(this);
    this.handleBlur.bind(this);
    this.handleChange.bind(this);
    this.handleclickSearchBar.bind(this);
    this.state={
      p_hidden:false
    }
  }
  handleclickSearchBar(){
    $('.merchants-searbar-input').focus()
  }
  handleFocus(e){
  }
  handleChange(e){
    var onChange = this.props.onChange;
    if(e.target.value.length > 0){
      // this.setState({
      //   p_hidden:true,
      // });
      $('.merchants-searbar-div1').css('display','none')
    }else {
      // this.setState({
      //   p_hidden:false,
      // });
      $('.merchants-searbar-div1').css('display','block')
    }
    if(onChange && typeof onChange == "function"){
      onChange(e.target.value);
    }
  }

  componentDidMount(){

  }
  handleBlur(e){

  }
  render() {
    console.log(this.props.width);
    console.log(this.props.height);
    return (
        <div className="merchants-searbar">
          <input className="merchants-searbar-input" onFocus={this.handleFocus}
                 onBlur={this.handleBlur} onChange={this.handleChange.bind(this)}/>
          <div disabled="true" className="merchants-searbar-div1" onClick={this.handleclickSearchBar} hidden={this.state.p_hidden}>
            <div className="merchants-searbar-div2">
              <img src="../i/search-icon.png"/>
              <p>输入商家名称、地区关键字</p>
            </div>
          </div>
        </div>
     );
  }
}
