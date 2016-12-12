import React from 'react';
import { Router,Link ,hashHistory} from 'react-router';
import {
  NavBar,
  Field,
  Button,
  Container,
  Group,
  List,
  Modal,
}from 'amazeui-touch';
import "../../style/login.scss"
var Api = require('../Tools/Api')
var fetch = require('isomorphic-fetch')
let fields = [{
  label: '请输入用户名',
  type: 'user',
  icon: <p>{'用户名'}</p>
},
  {
    label: '请输入密码',
    type: 'password',
    icon: <p >密&nbsp;&nbsp;&nbsp;码</p>
  }]


export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.changecodebutton = this.changecodebutton.bind(this)
    this.clickcodebutton = this.clickcodebutton.bind(this)
    this.textfieldchange = this.textfieldchange.bind(this)
    this.handleAction = this.handleAction.bind(this)
    this.login = this.login.bind(this)
    this.state = {
      esVersion: `${this.props.name} v1.0`,
      clickCounts: 60,
      codebuttondisabled:true,
      loginbuttondisabled:true,
      user:'',
      password:'',
      isOpen:false,
      role:'loading',
      roletitle:''
    };

  };


  login(){
    this.setState({
      isOpen:true,
      roletitle:'登录中...',
      role:'loading',
    });
    let self = this;
    Api.POST(Api.url('/owner/login.jhtml'),{mobileNo:this.state.user,code:this.state.password},(data)=>{
      console.log(data);
      self.setState({
        isOpen:true,
        roletitle:data.msg ,
        role:'alert',
      })
      if (data.success){
        Api.saveUserInfo(data.data);
        window.location.hash = "/owner/merchants"
      }else {
        self.setState({
          roletitle:data.msg,
          role:'alert',
        })
      }
    },(e)=>{
      self.setState({
        roletitle:e.msg,
        role:'alert',
      })
    })
  }
  clickcodebutton(){
    this.setState({
      isOpen:true,
      roletitle:'请求验证码中...',
      role:'loading',
    });
    let self = this;
    Api.POST(Api.url("/owner/requestCode.jhtml"),{mobileNo:this.state.user},(data)=>{
      if (data.success) {
        self.changecodebutton();
        self.setState({
          roletitle:'请求成功',
          role:'alert',
        })
        setTimeout(()=>{
          self.setState({
            isOpen:true,
          })
        },1000)
      }else{
        self.setState({
          isOpen:true,
          roletitle:data.msg ,
          role:'alert',
        })
      }

    },(e)=>{
      self.setState({
        roletitle:'请求失败',
        role:'alert',
      })
    })

  }
  handleAction(data){
    this.setState({
      isOpen:false,
    });
  }
  changecodebutton() {

    var count = 60;
    var button = document.getElementById('codebutton');
    button.disabled = true;
    this.timer = setInterval(function () {
      button.innerHTML = (count -= 1) +  "s后重新获取"
      this.setState({
        clickCounts:count
      });

      if (count <= 0){
        clearInterval(this.timer);
        button.innerHTML = '获取密码';
        button.disabled = false;
        this.setState({
          clickCounts:60
        })
        return;
      }
    }.bind(this), 1000);
  }

  componentDidMount() {
    if (Api.fetctUserInfo()){
      window.location.hash = "/owner/merchants";
    }
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }


  textfieldchange(){
    let user = document.getElementById('user').value
    let password = document.getElementById('password').value
    let loginabled = (user == ''|| password == '' || user == null || password == null)
    let codeabled = user == ''|| user == null || this.state.clickCounts < 60
    this.setState({
      user:user,
      password:password,
      loginbuttondisabled:loginabled,
      codebuttondisabled:codeabled
    })

  }

  render() {
    return (<Container  >

      <Group className ="login-group" noPadded>
        <Modal
          isOpen = {this.state.isOpen}
          id="modal"
          role = {this.state.role}
          title = {this.state.roletitle}
          onAction={this.handleAction}
        >
        </Modal>
        <List >
          {fields.map((field, i) => {
            return (
              <List.Item
                key={i}
                media={field.icon}
                nested="input"
              >
                <Field id={field.type}
                       placeholder={field.label}
                       onChange = {this.textfieldchange}

                />
                {
                  i == 0 ? <Button classPrefix="codebutton"
                                   ref="codebutton"
                                   id="codebutton"
                                   disabled={this.state.codebuttondisabled}
                                   onClick={this.clickcodebutton}

                  >获取密码
                  </Button> : null

                }

              </List.Item>
            );
          })}
        </List>
      </Group>
      <Button ref="button"
              className = "login-button"
              disabled = {this.state.loginbuttondisabled}
              onClick={this.login}

      >登录
      </Button>
      <p className="login-prompt">登录即注册为修车人拥护，且与微信绑定。</p>
    </Container>);

  }

}





