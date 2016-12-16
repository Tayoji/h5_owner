/**
 * Created by xiucheren on 16/12/15.
 */
import React from 'react';
import '../../style/merchantsselector.scss';
var Api = require('../Tools/Api');
//服务
const services = [{
  name: '',
  values: [{name: "全部服务", value: "all"}, {name: "洗车", value: "xiche"}, {name: "保养", value: "baoyang"},
    {name: "维修", value: "weixiu"}, {name: "钣金喷漆", value: "banjinpenqi"}, {name: "美容装饰", value: "meirong"},
    {name: "轮胎轮毂", value: "luntai"}, {name: "加装改装", value: "jiazhuanggaizhuang"}, {name: "道路救援", value: "jiuyuan"}]
}];

//排序
const sorts = [{
  name: '',
  values: [{name: "综合排序", value: "default"}, {name: "距我最近", value: "distance"}, {name: "好评优先", value: "review"}]
}];

//筛选
const selectors = [{
  name: '商家类型',
  values: [
    {name: "全部商家", value: ""}, {name: "汽修站", value: "traditionShop"}, {
      name: "配件专营店",
      value: "partShop"
    }, {name: "分时租赁站", value: "rentShop"}
  ]
}, {
  name: '维修保障金',
  values: [{name: "不限", value: "1"}, {name: "¥1000", value: "1"}, {name: "¥2000", value: "2"},
    {name: "¥5000", value: "3"}, {name: "¥20000", value: "4"},
    {name: "¥50000", value: "5"}, {
      name: "¥200000", value: "7"
    }]
}]

export default class MerchantsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.loadBaiduList.bind(this);
    this.state = {
      data:selectors,
      indexpaths:[0,0],
      option:null,
    }
  }
  componentWillReceiveProps(prors){
    let prorsoOption = prors.option;
    let stateOption = this.state.option;
    var indexpaths = this.state.indexpaths;
    if (prorsoOption){
      let data = null;
      $('.merchants-selector-body').css('display','block');
      switch (prorsoOption.type){
        case "services":
          for (var index = 0;index<services[0].values.length;index++){
            var item = services[0].values[index];
            if (prorsoOption.value == item.value){
              indexpaths[0] = index;
              break;
            }
          }

          data = services;
          break;
        case "city":
          this.loadBaiduList({cityCode:268},prorsoOption);
          break;
        case "sort":
          for (var index = 0;index<sorts[0].values.length;index++){
            var item = sorts[0].values[index];
            if (prorsoOption.value == item.value){
              indexpaths[0] = index;
              break;
            }
          }
          data = sorts;
          break
        case 'selector':
          for (var x = 0;x<selectors.length;x++){
            var items = selectors[x].values;
            for (var y = 0;y<items.length;y++){
              var item = items[y];

              if (item.value == prorsoOption.value || prorsoOption.value1 == item.value){
                indexpaths[x] = y;
              }
            }
          }
          data= selectors;
          break
      }
      if (data){
        this.setState({
          option:prorsoOption,
          data:data,
          indexpaths:indexpaths
        })
      }else {
        this.setState({
          option:prorsoOption,
        })
      }
      $('.merchants-selector-body-con').fadeIn(500)

      // if (stateOption && stateOption.type == prorsoOption.type){
      // }

    }else{
      $('.merchants-selector-body-con').fadeOut(500,(e)=>{
        this.setState({
          data:null,
          option:null
        })
        $('.merchants-selector-body').css('display','none')
      })
    }
  }
  componentDidMount(){
    // this.loadBaiduList({cityCode:268});
    $('.merchants-selector-body').css('display','none');
  }
  loadBaiduList(p,option){
    var indexPaths = this.state.indexpaths;

    let listLocalStorage = window.localStorage.getItem(JSON.stringify(p));
    if (listLocalStorage){

      let list = JSON.parse(listLocalStorage);
      for (var index = 0;index<list.length;index++){
        var item = list[index];
        if (option.value == item.value){
          indexPaths[0] = index;
          break;
        }
      }
      this.setState({
        data:[{name:'',values:JSON.parse(listLocalStorage)}],
        indexpaths:indexPaths,
        option:option
      })
      return;
    }
    let self = this;

    Api.GET(Api.url('/common/area/baiduList.jhtml'),p,(res)=>{
      if (res.success){
        let list = res.data.areaList.map((item,index)=>{
          if (item.value == self.props.option.value){
            indexPaths[0] = index;
          }
          return {name:item.name,value:item.id};
        })

        window.localStorage.setItem(JSON.stringify(p),JSON.stringify(list));
        self.setState({
          data:[{name:'',values:list}],
          indexpaths:indexPaths,
          option:option


        })
      }else {

      }
    },(e)=>{

    });
  }
  handleClickOptionInput(i,j){
    var {indexpaths,option,data} = this.state;
    indexpaths[i] = j;
    this.setState({
      indexpaths:indexpaths
    })

    if(option && option.type != 'selector'){
      $('.merchants-selector-body-con').fadeOut(500,(e)=>{
        this.setState({
          data:null,
          option:null
        })
        option.name = data[0].values[indexpaths[0]].name;
        option.value = data[0].values[indexpaths[0]].value;
        if (this.props.onSelected){
          this.props.onSelected(option);
        }
        $('.merchants-selector-body').css('display','none')

      })
    }
  }
  render() {
    const {data,option,indexpaths} = this.state;
    return (<div className="merchants-selector-body">
      <div className="merchants-selector-body-con">
        <div className="merchants-selector-body-options">
          {
            data ?
            data.map((item,i)=>{
              return (<div className="merchants-selector-body-options-item" key={i}>
                {
                  item.name == "" ?  null : <p>{item.name}</p>
                }
                <div>
                  {
                    item.values.map((button,j)=>{
                      var selected = false;
                      for (var x = 0;x<indexpaths.length;x++){
                        if (x == i&&indexpaths[x]==j){
                          selected = true;
                          break;
                        }
                      }
                      return (<input value={button.name} disabled={( i == 1 &&  indexpaths[0] > 1)} className={`merchants-selector-button-${  selected ? "selected":"normal"}`} type="button" key={j} onClick={
                        this.handleClickOptionInput.bind(this,i,j)
                      }/>);
                    })
                  }
                </div>
              </div>);
            }) : null
          }
        </div>
        {
          option && option.type == 'selector' ? (<div>
            <p className="merchants-selector-note">注:维修保障金是修车人网为使用我平台服务的车主做维修担保特设的专用资金，主要用于承担应维修厂维修能力或修车人提供商品原因造成的二次维修费用</p>
            <div className="merchants-selector-buttons">
              <button className="chongzhi-button" onClick={(e)=>{
                this.setState({
                  indexpaths:[0,0]
                })
              }}>重置</button>
              <div></div>
              <button className="true-button" onClick={(e)=>{
                $('.merchants-selector-body-con').fadeOut(500,(e)=>{
                  this.setState({
                    data:null,
                    option:null
                  })
                  option.value = data[0].values[indexpaths[0]].value;
                  option.value1 = data[1].values[indexpaths[1]].value;
                  if (this.props.onSelected){
                    this.props.onSelected(option);
                  }
                  $('.merchants-selector-body').css('display','none')

                })
              }}>确定</button>
            </div>
          </div>) : null
        }
      </div>
    </div>);
  }
}
