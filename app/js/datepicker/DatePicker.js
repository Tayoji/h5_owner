/**
 * Created by xiucheren on 16/12/13.
 */
import React from 'react';
import '../../style/datepicker.scss';
import iScroll from 'iscroll/build/iscroll-probe';


export default class HourMinPicker extends React.Component {
  constructor(props) {
    super(props);
    this.houer = 0;
    this.min = 0;
    this.date = null;
    this.state = {
      isOpen:false,
      date:null,
    }
  }

  componentDidMount() {


  }
  componentWillReceiveProps(props){

    this.setState({
      isOpen:props.isOpen,
    });
    let date = props.date
    this.houer = date ? date.getHours() : 0;
    this.min = date ? date.getMinutes() : 0;
    let self = this;
    if (date){
      this.date = date;
    }

    var timer = setTimeout(() => {
      $("#datepicker-data-hour-iscroll").scrollTop(25 * (self.houer));
      $("#datepicker-data-min-iscroll").scrollTop(25 * (self.min));
      clearTimeout(timer)
    }, 10)
  }
  handleClick(){
    if (this.props.onSelect && this.date){
      this.props.onSelect(this.date);
    }


  }
  render() {
    var hours = [];
    var mins = [];
    for (var i = -3; i < 27; i++) {
      if (i < 0) {
        hours.push(i + 24);
      } else if (i >= 24) {
        hours.push(i - 24);
      } else {
        hours.push(i);
      }
    }
    for (var i = -3; i < 63; i++) {
      if (i < 0) {
        mins.push(i + 60);
      } else if (i >= 60) {
        mins.push(i - 60);
      } else {
        mins.push(i);
      }
    }
    var hourtimer;
    var mintimer;
    console.log('render',this.props)
    let self = this;
    //style={{display:this.state.isOpen ? 'block': 'none'}}
    return (
    this.state.isOpen ? <div className="datepicker-body">
        <div className="datepicker-con">
          <div className="datepicker-data">
            <div className="datepicker-data-line" disabled="false"></div>
            <div id="datepicker-data-hour-iscroll"
                 onScroll={(e) => {
                   if (hourtimer)
                     clearTimeout(hourtimer)
                   hourtimer = setTimeout(function () {
                     let hour = Math.round($("#datepicker-data-hour-iscroll").scrollTop() / 25.0)
                     $("#datepicker-data-hour-iscroll").scrollTop(hour * 25)
                     if (self.date){
                       self.date.setHours(hour)
                     }
                   }, 200)


                 }}
            >
              <ul className="datepicker-data-hour">
                {
                  hours.map((item, index) => {
                    return (<li key={index}>{item < 10 ? `0${item}` : item}</li>)
                  })
                }
              </ul>
            </div>

            <p>时</p>
            <div id="datepicker-data-min-iscroll"
                 onScroll={(e) => {
                   if (mintimer)
                     clearTimeout(mintimer)
                   mintimer = setTimeout(function () {
                     let min = Math.round($("#datepicker-data-min-iscroll").scrollTop() / 25.0);
                     $("#datepicker-data-min-iscroll").scrollTop(min * 25)
                     if (self.date){
                       self.date.setMinutes(min);
                     }
                   }, 300)
                 }}
            >

              <ul className="datepicker-data-min">
                {
                  mins.map((item, index) => {
                    return (<li key={index}>{item < 10 ? `0${item}` : item}</li>)
                  })
                }
              </ul>
            </div>
            <p>分</p>
          </div>
          <div className="datepicker-button">
            <input value='确定' type="button" onClick={this.handleClick.bind(this)}/>
          </div>
        </div>
      </div> : null);
  }
}
