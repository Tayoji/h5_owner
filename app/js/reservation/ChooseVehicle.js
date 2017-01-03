/**
 * Created by xiucheren on 16/12/12.
 */
import React from 'react';
import {
  Container,
  Group,
  List
}from 'amazeui-touch';
import  '../../style/choosevehicle.scss';
import {
  hashHistory
}from 'react-router'
var Api = require('../Tools/Api')
export default class ChooseVehicle extends React.Component {

  constructor(props) {
    super(props);
    this.selectMake = null;
    this.vehicleModelsPageX = 0;
    this.vehicleSubmodelsPageX = 0;
    this.vehicleModelsMoved = true;
    this.overscroll.bind(this);
    this.vehicleSubmodelsState = false;

    this.state = {
      makes: [],
      selectMake: null,

      models: [],
      selectModel: null,

      submodelList: [],
      selectSubModel: null,


    }
  }
  overscroll(el){
    el.addEventListener('touchstart', function() {
      var top = el.scrollTop
        , totalScroll = el.scrollHeight
        , currentScroll = top + el.offsetHeight;
      //If we're at the top or the bottom of the containers
      //scroll, push up or down one pixel.
      //
      //this prevents the scroll from "passing through" to
      //the body.
      if(top === 0) {
        el.scrollTop = 1;
      } else if(currentScroll === totalScroll) {
        el.scrollTop = top - 1;
      }
    });
    el.addEventListener('touchmove', function(evt) {
      //if the content is actually scrollable, i.e. the content is long enough
      //that scrolling can occur
      if(el.offsetHeight < el.scrollHeight)
        evt._isScroller = true;
    });
  }
  /**
   * 禁止浏览器下拉回弹
   */
   stopDrop() {
    var lastY;//最后一次y坐标点
    $(".body").on('touchstart', function(event) {
      lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
    });
    $(".body").on('touchmove', function(event) {
      var y = event.originalEvent.changedTouches[0].clientY;
      var st = $(this).scrollTop(); //滚动条高度
      console.log("st = "+st);
      if (y >= lastY && st <= 0) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
        lastY = y;
        event.preventDefault();
      }
      lastY = y;

      //方法三
      // var abc=$(document.body).scrollTop();
      // console.log("abc = "+abc);
      // if (abc>0) {
      //   $(document.body).scrollTop(0);
      // }
    });
  }
  componentDidMount() {
    let self = this;
    Api.setTitle("选择车型");
    document.body.addEventListener('touchstart', function(evt) {
      if (document.body.scrollTop > 0){
        evt.preventDefault();
        document.body.scrollTop = 0
        // alert("ssss")
      }
    });
    document.body.addEventListener('touchmove', function(evt) {
      if (document.body.scrollTop > 0){
        evt.preventDefault();
        document.body.scrollTop = 0
        // alert("ssss")
      }
    });

    Api.GET(Api.url('/owner/vehicle/makes.jhtml'), null, (res) => {
      if (res.success) {
        self.setState({
          makes: res.data,
        })
      }
      else {

      }
    }, (e) => {

    })
  }

  handleMake(make, e) {
    this.setState({
      selectMake: make,
      models: [],
      selectModel: null,
    })
    this.vehicleModelsMoved = true;

    let self = this;

    Api.GET(Api.url('/owner/vehicle/models.jhtml'), {makeId: make.id}, (res) => {
      if (res.success) {
        self.setState({
          models: res.data,
        })
      }
      else {
      }
    }, (e) => {

    })
  }

  handleModel(model, e) {
    this.setState({
      selectModel: model,
    })
    this.vehicleModelsMoved = false;
    $(".vehicle-models").animate({"left": 60})
    let self = this;
    Api.GET(Api.url('/owner/vehicle/submodels.jhtml'), {modelId: model.id}, (res) => {
      if (res.success) {
        self.setState({
          submodelList: res.data,
        })
      }
      else {
      }
    }, (e) => {

    })
  }

  handleSubModel(subModel, e) {
    const {selectMake} = this.state;
    window.sessionStorage.setItem('vehicleinfo', JSON.stringify({
      name: selectMake.name + subModel.name,
      id: subModel.id
    }))
    hashHistory.goBack();

  }

  handleVehicleModelsMove(e) {
    var x = 60 + e.changedTouches[0].pageX - this.vehicleModelsPageX;
    if (x < 60) {
      x = 60;
    }
    $(".vehicle-models").css("left", x)
  }

  render() {
    const {makes, selectMake, models, selectModel, submodelList} = this.state;
    return (<Container className = "body">
      {/*
       第一层 车型界面
       */}
      <div className="vehicle-makes">


        {
          makes.map((item, index) => {
            return (<Group className="vehicle-group" header={item.name} key={index} noPadded>

              <List>
                {
                  item.makeList.map((make, i) => {
                    return (<List.Item
                      key={i}
                      title={make.name}
                      media={<img className="list-icon" src={make.logo}/>}
                      onClick={this.handleMake.bind(this, make)}
                    >
                    </List.Item>)
                  })
                }
              </List>
            </Group>);
          })
        }
      </div>
      {/*
       第二层 车型界面
       */}
      {
        selectMake ? <div className="vehicle-models"

                          onTouchStart={(e) => {
                            this.vehicleModelsPageX = e.changedTouches[0].pageX;
                            {/*this.overscroll(document.querySelector('.vehicle-models'))*/}
                          }}
                          onTouchCancel={(e)=>{
                            if (this.vehicleModelsMoved) {
                              if ($(".vehicle-models").offset().left - 60 > $(".vehicle-models").width() / 2) {
                                $(".vehicle-models").animate({"left": window.innerWidth}, () => {
                                  this.setState({
                                    selectMake: false,
                                  })
                                })
                              } else {
                                $(".vehicle-models").animate({"left": 60})

                              }
                            }
                          }}
                          onTouchMove={this.handleVehicleModelsMove.bind(this)}
                          onTouchEnd={(e) => {
                            if (this.vehicleModelsMoved) {
                              if ($(".vehicle-models").offset().left - 60 > $(".vehicle-models").width() / 2) {
                                $(".vehicle-models").animate({"left": window.innerWidth}, () => {
                                  this.setState({
                                    selectMake: false,
                                  })
                                })
                              } else {
                                $(".vehicle-models").animate({"left": 60})

                              }
                            }
                          }
                          }
        >
          <List className="vehicle-list-header">
            <List.Item title={selectMake.name}
                       media={<img className="list-icon" src={selectMake.logo}/>}
            />
          </List>
          {
            models.map((item, index) => {
              return (<Group className="vehicle-group" header={item.name} key={index} noPadded>
                <List>
                  {
                    item.modelList.map((model, i) => {
                      return (<List.Item
                        key={i}
                        title={model.name}
                        onClick={this.handleModel.bind(this, model)}
                      >
                      </List.Item>)
                    })
                  }
                </List>
              </Group>);
            })
          }
        </div> : null
      }

      {/*
       第三层 车型界面
       */}
      {
        selectModel ? <div className="vehicle-submodels"
                           onTouchStart={(e) => {
                             this.vehicleSubmodelsPageX = e.changedTouches[0].pageX;
                           }}
                           onTouchMove={(e) => {
                             var x = 120 + e.changedTouches[0].pageX - this.vehicleSubmodelsPageX;
                             if (x < 120) {
                               x = 120;
                             }
                             $(".vehicle-submodels").css("left", x)
                           }}
                           onTouchEnd={(e) => {
                             if ($(".vehicle-submodels").offset().left - 120 > $(".vehicle-submodels").width() / 2) {
                               $(".vehicle-submodels").animate({"left": window.innerWidth}, () => {
                                 this.setState({
                                   selectModel: false,
                                 })
                               })
                             } else {
                               $(".vehicle-submodels").animate({"left": 120});
                             }

                           }}>
      <List className="vehicle-list-header">
        <List.Item title={selectModel.name}
        />
      </List>
      {
        submodelList.map((item, index) => {
          return (<Group className="vehicle-group" header={item.name} key={index} noPadded>
            <List>
              {
                item.submodelList.map((model, i) => {
                  return (<List.Item
                    key={i}
                    title={model.name}
                    onClick={this.handleSubModel.bind(this, model)}
                  >
                  </List.Item>)
                })
              }
            </List>
          </Group>);
        })
      }
    </div>
  :
    null
  }

</Container>);
}

}
