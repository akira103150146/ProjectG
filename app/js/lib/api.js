function bim_serveroption(url,method,headers,json,body){
    this.url = url
    this.method = method
    this.headers = headers
    this.json = json    
    this.body = body  
}
function bim_userinfo(id,name,password,number,identity,emailAddress,createDate){
  this.id = id
  this.name = name
  this.password = password
  this.number = number
  this.identity = identity
  this.emailAddress = emailAddress
  this.createDate = createDate
}
function bim_app_window(){    
  this.host = 'http://140.118.127.140:8080'
  this.permission = '/bim/api/'
  this.api = ''
  this.op = '' //定義執行的操作
  this.how = '' //定義method
  this.headers 
  this.option
  this.auth
}
bim_app_window.prototype.Send = function(obj){   
  if (this.op === 'login') 
    this.headers = { 'User-Agent': 'request' }
  else {
    //console.log(this.auth)
    this.headers = { 'User-Agent': 'request', 'authorization': this.auth }    
  }
  if(obj)
    this.option = new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true, obj)
  else
    this.option =new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true,null)  
  if(!this.api||!this.op||!this.how||!this.headers)alert('send package error!')   
}

bim_app_window.prototype.Reset = function(){
  this.api = null
  this.op = null
  this.how = null
  this.headers = null
  this.option = null
  console.log('reset')
}
bim_app_window.prototype.GetOption = function(){
  return this.option
}
bim_app_window.prototype.SetAuth = function(value){
  this.auth = value
}
bim_app_window.prototype.Login = function(account,password){
  let obj = {'number':account,'password':password}
  this.api = 'staff/'  
  this.op = 'login'
  this.how = 'POST'    
  this.Send(obj) 
}
bim_app_window.prototype.GetInfo = function(){
  this.api = 'staff/'
  this.op = 'info'
  this.how = 'GET'  
  this.Send(null)
}
bim_app_window.prototype.Logout = function(){
  this.api = 'staff/'
  this.op = 'logout'
  this.how = 'DELETE'  
  this.Send(null)
}
bim_app_window.prototype.Notify = function(info){
  //送出設備資訊

}
bim_app_window.prototype.AddUser = function(value){
  let obj = {'name' : value.name,
             'password' : value.password,
             'number' : value.number,
             'identity' : value.id,
             'emailAddress': value.emailAddress}
  this.api = 'admin/staff/'
  this.op = 'add'
  this.how = 'POST' 
  this.Send(obj)
}
bim_app_window.prototype.UpdateUser = function(id,info){
  this.api = 'admin/staff/'
  this.op = 'update?id=' + id 
  this.how = 'POST'  
  this.Send(info)
}
bim_app_window.prototype.RemoveUser = function(id){
  this.api = 'admin/staff/'
  this.op = 'remove?id=' + id
  this.how = 'DELETE'
  this.Send(null)
}
bim_app_window.prototype.GetStaffList = function(){
  this.api = 'admin/staff/'
  this.op = 'list'
  this.how = 'GET'
  this.Send(null) 
}
bim_app_window.prototype.GetFormInfo = function(id){
  this.api = 'form/template/'
  this.op = 'info?id=' + id
  this.how = 'GET'  
  this.Send(null)
}
bim_app_window.prototype.AddFormTemplate = function(info){
  this.api = 'form/template/'
  this.op = 'add'
  this.how = 'POST' 
  this.Send(info)
}
bim_app_window.prototype.UpdateFormTemplate = function(id,info){
  this.api = 'form/template/'
  this.op = 'update?id=' + id
  this.how = 'POST'
  this.Send(info)
}
bim_app_window.prototype.RemoveFormTemplate = function(id){
  this.api = 'form/template'
  this.op = 'remove?id=' + id
  this.how = 'DELETE'
  this.Send(null)
}
bim_app_window.prototype.GetFormList = function(){
  this.api = 'form/template/'
  this.op = 'list'
  this.how = 'GET' 
  this.Send(null)
}
bim_app_window.prototype.GetDeviceList = function(){
  this.api = 'device/'
  this.op = 'list'
  this.how = 'GET'
  this.Send(null)
}
bim_app_window.prototype.AddDevice = function(info){
  let obj = {'name':info.name,
              'description': info.Description,
              'position': info.position,
              'tagName': info.tagName
  }
  this.api = 'admin/device/'
  this.op = 'add'
  this.how = 'POST'
  this.Send(obj)
}
bim_app_window.prototype.RemoveDevice = function(id){
  this.api = 'admin/device/'
  this.op = 'remove?id=' + id 
  this.how = 'DELETE'
  this.Send(null)
}
bim_app_window.prototype.UpdateDevice = function(id,info){
  this.api = 'admin/device/'
  this.op = 'update?id=' + id
  this.how = 'POST'
  this.Send(info)
}
module.exports = bim_app_window