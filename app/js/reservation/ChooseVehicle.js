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
    this.state = {
      makes: [],
      selectMake: null,

      models: [],
      selectModel: null,

      submodelList: [],
      selectSubModel: null,


    }
  }

  componentDidMount() {
    console.log(this)
    let self = this;
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
      models:[],
      selectModel:null,
    })
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
  handleSubModel(subModel,e){
    const {selectMake} = this.state;
    window.sessionStorage.setItem('vehicleinfo',JSON.stringify({name:selectMake.name+subModel.name,id:subModel.id}))
    hashHistory.goBack();

  }
  render() {
    const {makes, selectMake, models, selectModel, submodelList} = this.state;
    return (<Container scrollable>
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
        selectMake ? <div className="vehicle-models">
          <List className = "vehicle-list-header">
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
        selectModel ? <div className="vehicle-submodels">
          <List className = "vehicle-list-header">
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
                        onClick={this.handleSubModel.bind(this,model)}
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

    </Container>);
  }

}
