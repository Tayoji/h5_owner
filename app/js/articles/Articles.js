import React from 'react';
import{
  Container,
  List,
  Modal
} from 'amazeui-touch';
import ArticleItem from './ArticleItem';
var Api = require('../Tools/Api')
var Tools = require('../Tools/Tools')

import ReactIScroll from 'reactjs-iscroll';
import iScroll from 'iscroll/build/iscroll-probe';
export default class Articles extends React.Component {
  constructor(props) {
    super(props)
    this.onScroll = this.onScroll.bind(this);
    this.loadData = this.loadData.bind(this);
    this.openModel = this.openModel.bind(this);
    this.closeModel = this.closeModel.bind(this);
    this.alertwithtext = this.alertwithtext.bind(this);
    this.state = {
      articles: [],
      pageNo: 0,
      pullUpState: false,
      isOpen: false,
      alerttext: ''
    }

  }

  componentDidMount() {
    let scroll = this.refs.articlesrefresh;
    scroll.setState({
      pullDownState: 2,
      pullDownCls: 'iscroll-loading'
    })
    this.loadData(0, () => {
      setTimeout(() => {
        scroll.setState({
          pullUpState: 0,
          isScrolling: false
        }, () => {
          scroll.lock = false;
          scroll.iScrollInstance.refresh();
        });
      }, 200);

    })

  }

  onScroll() {
  }

  openModel(text) {
    this.setState({
      isOpen: true,
      alerttext: text
    });
  }

  closeModel() {
    let self = this;
    setTimeout(() => {
      self.setState({
        isOpen: false,
      })
    }, 1000);
  }

  alertwithtext(text) {
    this.openModel(text);
    this.closeModel();
  }

  loadData(pageNo, callback) {
    let self = this;
    Api.GET(Api.url("/cms/articles.jhtml"), {"platform": "owner_app", "pageNo": `${pageNo}`}, (res) => {
      let datas = res.data.articles;
      if (datas) {
        var articles = self.state.articles;
        if (pageNo > 0) {
          articles = articles.concat(datas);
        } else {
          articles = datas;
        }
        self.setState({
          articles: articles,
          pullUpState:res.data.hasNext
        })
        if (datas.length == 0) {
          self.alertwithtext('没有更多了');
        }
      }
      callback();

    }, (e) => {
      self.alertwithtext(e.message);
      callback();
    })
  }

  handleRefresh(upordown, callback) {
    let scroll = this.refs.articlesrefresh.iScrollInstance;
    var {pageNo} = this.state;

    if (callback && typeof callback === 'function') {

      if (upordown == 'up') {
        pageNo++;
      } else {
        pageNo = 0;
      }
      this.setState({
        pageNo: pageNo
      });
      this.loadData(pageNo, callback);
    }
  }


  render() {
    const {articles, pullUpState} = this.state
    return (<Container scrollable={false}>
      <Modal
        isOpen={this.state.isOpen}

        title={'提示'}
        onDismiss={this.closeModel}
      >
        <p style={{margin: '0px', color: '#333'}}>{this.state.alerttext}</p>
      </Modal>
      <ReactIScroll
        iScroll={iScroll}
        id="articles-refresh"
        ref="articlesrefresh"
        pullUp={pullUpState}
        handleRefresh={this.handleRefresh.bind(this)}
      >
        <List style={{margin: '0px', paddingTop: '5px'}}

        >
          {articles.map((item, i) => {
            return (
              <ArticleItem key={i}
                           model={item}
              />
            )
          })
          }
        </List>

      </ReactIScroll>
      {this.props.children}
    </Container>)
  }
}

