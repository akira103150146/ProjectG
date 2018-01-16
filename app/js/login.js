var request = require('request');
var host = 'http://lei-k.ddns.net:8081';
var login_options ;
var logout_options = {
    url: host + '/bim/api/staff/logout',
    method: "DELETE",
    headers: {
        'User-Agent': 'request',
        'authorization' : auth
      },
      json: true,   // <--Very important!!!
};
var update_info_options = {
    url: host + '/bim/api/staff/update',
    method: "POST",
    headers: {
        'User-Agent': 'request',
        'authorization' : auth
      },
      json: true,   // <--Very important!!!
      body: info
};
var get_info_options = {
    url: host + '/bim/api/staff/info',
    method: "GET",
    headers: {
        'User-Agent': 'request',
        'authorization' : auth
      },
      json: true,   // <--Very important!!!
  };

  function logout_callback(error, response, body) {
    console.log("");
    console.log("logout callback:");
    console.log("http status code: " + response.statusCode);
    console.log(body);
  }

  function do_logout(){
    request(logout_options, logout_callback);
  }

  var info;

  function update_info_callback(error, response, body){
    console.log("");
    console.log("update info callback:");
    console.log("http status code: " + response.statusCode);
    console.log(body);

    do_logout();
  }

  function do_update_info(error, response, body){
    info.emailAddress = 'aabbc!@gamil.com';
    request(update_info_options, update_info_callback);
  }

  function get_info_callback(error, response, body){
    console.log("");
    console.log("get info callback:");
    console.log("http status code: " + response.statusCode);
    console.log(body);

    info = body['content'];

    do_update_info();
  }

  function do_get_info(error, response, body){
    request(get_info_options, get_info_callback);
  }

  var auth;
  var id;

  function login_callback(error, response, body) {
    console.log("login callback: ");
    console.log("http status code: " + response.statusCode);
    console.log(body);
    
    if (!error && response.statusCode == 200) {
      // 獲取用戶id、token拼接後作為簽證(auth)備用
      id = body['content'].id;
      auth = id + '_' + body['content'].token;
      console.log("auth: " + auth);

      do_get_info();
    }
   
  }
  
  function login_(account,password){
    
    var loginJSONObject = {'name':account,'password':password };
    login_options= {
        url: host + '/bim/api/staff/login',
        method: "POST",
        headers: {
            'User-Agent': 'request'
        },
        json: true,   // <--Very important!!!
        body: loginJSONObject
    };

    request(login_options, login_callback);
   

  }

  

  