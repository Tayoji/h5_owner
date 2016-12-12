/**
 * Created by xiucheren on 16/11/14.
 */
import React from 'react';
import{
  Modal,
}from 'amazeui-touch';
import '../../style/articleitem.scss';
var Tools = require('./../Tools/Tools')

export default class ArticleItem extends React.Component{
  constructor(props){
    super(props)

  //href ={model.path}

  }

  render(){
    const model = this.props.model
    return (
      <a href={model.path}
      >
        <div className="article-item">
          <div className="article-item-header">
            <img src={model.coverImage}/>
            <div className="article-item-con">
              <b className="title">{model.title}</b>
              <p className="subtitle">{model.abstracts}</p>
            </div>
          </div>
            <p className="article-item-data">{`${Tools.getNYRStr(model.createDate)}`}&nbsp;&nbsp;&nbsp;{`阅读${(model.hits) ? model.hits : 0 }`}</p>
        </div>
        <hr/>
      </a>
    )
  }
}

