function bim_serveroption(url,method,headers,json,body){
    this.url = url;
    this.method = method;
    this.headers = headers;    
    this.body = body;  
}
function bim_userinfo(id,name,password,number,identity,emailAddress,createDate){
  this.id = id;
  this.name = name;
  this.password = password;
  this.number = number;
  this.identity = identity;
  this.emailAddress = emailAddress;
  this.createDate = createDate;
}
function bim_app_window(){  
  this.request = require('request');
  this.host = 'http://140.118.127.140:8080';
  this.permission = '/bim/api/';
  this.api = '';
  this.op = ''; //定義執行的操作
  this.how = ''; //定義method
  this.headers;
  this.loginsucess = false;  
  this.callbackfinish = false; 
}
bim_app_window.prototype.Send = function(obj){
  let option;
  console.log(this.op);
  if (this.op === 'login') this.headers = { 'User-Agent': 'request' };
  else this.headers = { 'User-Agent': 'request', 'authorization': localStorage.getItem('auth') };
  if(obj)
    option = new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true, obj);
  else
    option =new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true);  
  if(!this.api||!this.op||!this.how||!this.headers)alert('send package error!');  
  //this.request(option, this.bim_servercallback.bind(this));  //因為作為callback要綁定為現在的this 否則scope不會正確 
  const url = new URL(this.permission + this.api + this.op ,this.host);
  fetch(url,{method : this.how,body:obj, headers: this.headers ,credentials: "same-origin"}).then(this.testcallback,function(error){
    error.message;
  });
}
bim_app_window.prototype.testcallback = function(response){
  console.log(response);
}
bim_app_window.prototype.bim_servercallback = function (error, response, body){
  console.log("callback: ");
  console.log("http status code: " + response.statusCode);
  console.log(body);
  console.log('code :' + body['code']);
  console.log(this.op); 
  if(this.op === 'login'){
    let code = body['code'];
    if(code == -1001)alert(body['message']);
    else if(code == 100){
      localStorage.setItem("auth",body['content'].id + '_' + body['content'].token );
      console.log(localStorage.getItem('auth'));
      waitForCallbacks();
      this.callbackfinish = true;
      this.loginsucess = true;
    }
  }
  else if(this.op === 'logout'){
    localStorage.removeItem('auth');
    this.loginsucess = false;
  } 
}
bim_app_window.prototype.Reset = function(){
  this.api = null;
  this.op = null;
  this.how = null;
  this.headers = null;
}
bim_app_window.prototype.Login = function(account,password){
  let obj = {'name':account,'password':password};
  this.api = 'staff/';  
  this.op = 'login';
  this.how = 'POST';    
  this.Send(obj); 
}
bim_app_window.prototype.checklogin = function(){
  return this.loginsucess;
}
bim_app_window.prototype.GetInfo = function(){
  this.api = 'staff/';
  this.op = 'info';
  this.how = 'GET';  
  this.Send(null);
}
bim_app_window.prototype.Logout = function(){
  this.api = 'staff/';
  this.op = 'logout';
  this.how = 'DELETE';  
  this.Send(null);
}
bim_app_window.prototype.AddUser = function(name,password,number,id,email){
  let obj = {'name' : name,
             'password' : password,
             'number' : number,
             'identity' : id,
             'emailAddress' : email};
  this.api = 'admin/staff/';
  this.op = 'add';
  this.how = 'POST'; 
  this.Send(obj);
}
bim_app_window.prototype.Update = function(info){
  this.api = 'admin/staff/';
  this.op = 'update';
  this.how = 'POST';  
  this.Send(info);
}
bim_app_window.prototype.GetStaffList = function(){
  this.api = 'admin/staff/';
  this.op = 'list';
  this.how = 'GET'; 
}
bim_app_window.prototype.GetFormInfo = function(id){
  this.api = 'form/template/';
  this.op = 'info?id=' + Number(id);
  this.how = 'GET';  
  this.Send(null);
}
bim_app_window.prototype.AddFormTemplate = function(data){
  this.api = 'form/template/';
  this.op = 'add';
  this.how = 'POST'; 
  this.Send(data);
}
bim_app_window.prototype.GetFormList = function(){
  this.api = 'form/template/';
  this.op = 'list';
  this.how = 'GET'; 
  this.Send(null);
}

var bim = new bim_app_window(); 