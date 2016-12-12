/**
 * Created by xiucheren on 16/11/16.
 */
var fetch = require('isomorphic-fetch');
var Tools = require('./Tools')
let isRelease = false;
// https://192.168.1.17:9443  http://192.168.1.6:8000/api  http://192.168.1.15:8080/api
let base = isRelease ? 'https://api.xiucheren.net' : 'http://192.168.1.6:8000/api';

function tokenUrl() {
  return `${base}/oauth/token?grant_type=client_credentials`;
}


function saveUserInfo(data) {
  window.localStorage.setItem("user_info",JSON.stringify(data));
}
function fetctUserInfo() {
  let user =  window.localStorage.getItem("user_info")
  return user ? JSON.parse(user) : null;
}

function removeUserInfo() {
  window.localStorage.removeItem("user_info");
}
function articlesUrl(pageNo) {
  return `${base}/cms/articles.jhtml?platform=owner_app&pageNo=${pageNo}`;
}

function markerLocation(latitude,longitude,title,content) {
  return `http://api.map.baidu.com/marker?location=${latitude},${longitude}&title=${title}&content=${content}&output=html`;
}
function url(s) {
  return base + s;
}


function token(url, success, fail) {

  if (url.indexOf("https") == 0) {
    let urls = new Array();
    let host = base;
    urls = url.split("/");
    if (urls.length > 2) {
      host = urls[0] + "//" + urls[1] + urls[2];
    }
    let tokenobj = JSON.parse(window.localStorage.getItem(host));
    if (tokenobj && tokenobj.token_date  && ((new Date()).getTime() - tokenobj.token_date < tokenobj.expires_in * 1000)) {
      success(tokenobj.access_token);
    } else {
      getToken(host, success, fail);
    }
  } else {
    success(null);
  }
}


function getToken(host, success, fail) {
  $.ajax({
    url: host + '/oauth/token?grant_type=client_credentials',
    type: 'POST',
    async: true,
    headers: {
      "Authorization": "Basic " + Tools.base64encode("xiucheren-client-owner-ios:1a2730fc771f359db9ebe14b45b02705"),
    }, // 设置请求的 header
    success: (res)=> {

      let access_token = res.access_token;
      if (access_token) {
        res.token_date = (new Date()).getTime();
        let sss = JSON.stringify(res);
        window.localStorage.setItem(host, JSON.stringify(res));
        success(access_token);
      } else {
        fail({msg: "token请求失败"});
      }
    },
    error: (e)=> {

      fail({msg: "token请求失败"});
    },
  })
}


function request(url, method, data, success, fail) {
  token(url, (res) => {
    let header;
    if (res) {
      header = {"Authorization": "Bearer " + res};
    }
    var parameters = new Array();
    for (var p in data) {
      let ss = p + "=" + data[p];
      parameters.push(ss);
    }
    if (parameters.length > 0) {
      url += "?" + parameters.join("&");
    }
    console.log(url);
    $.ajax({
      url: url,
      type: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      headers: header, // 设置请求的 header
      success: function (res) {
        success(res);
      },
      error: function (e) {
        fail(e);
      }
    })
  }, (e) => {
    fail({msg: "token请求失败"});
  })

}

function POST(url, data, success, fail) {
  request(url, "POST", data, success, fail);
}

function GET(url, data, success, fail) {
  request(url, "GET", data, success, fail);
}

module.exports = {
  tokenUrl: tokenUrl,
  token: token,
  saveUserInfo:saveUserInfo,
  fetctUserInfo:fetctUserInfo,
  isRelease: isRelease,
  markerLocation:markerLocation,
  articlesUrl: articlesUrl,
  url: url,
  POST: POST,
  GET: GET
}
