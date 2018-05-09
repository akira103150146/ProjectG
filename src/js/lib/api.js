"use strict";

function bim_serveroption(url, method, headers, json, body) {
  this.url = url
  this.method = method
  this.headers = headers
  this.json = json
  this.body = body
}

function bim_app_window(){    
  this.host = 'http://114.34.236.121:8081'
  this.permission = '/bim/api/'
  this.api  = ''  
  this.op = '' //定義執行的操作 
  this.how  = '' //定義method
  this.headers   //標頭檔
  this.option
  this.auth
}

bim_app_window.prototype.Send = function(obj, succes_callback, err_callcack){  
 
  succes_callback =  succes_callback == null ?  function(msg){ console.log(msg) } : succes_callback
  err_callcack    =  err_callcack    == null ? function (err) { alert('伺服器錯誤'); console.log(err) } : err_callcack

  this.op != 'login' ? this.headers = { 'authorization': sessionStorage.getItem('Auth') }  : this.headers = {}
 
  if(obj)   
    this.option = new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true, obj)    
  else
    this.option = new bim_serveroption(this.host + this.permission + this.api + this.op, this.how, this.headers, true, null)  

    console.log(this.option)

  let tempthis = this

  $.ajax({
    beforeSend: function (request) {
      if (tempthis.op != 'login')  
        request.setRequestHeader("authorization", sessionStorage.getItem('Auth'))
    },
    error: err_callcack,
    success: succes_callback,
    contentType: "application/json",
    method: tempthis.option.method,
    processData: false,
    url: tempthis.option.url,
    dataType: "json",
    data: obj == null ? {} : JSON.stringify(obj)
  })
  this.Reset()
}
//////////////////////////////////////主要操作///////////////////////////////////////////
bim_app_window.prototype.Reset = function(){
  this.api  = null
  this.op   = null
  this.how  = null
  this.headers  = null
  this.option   = null
  console.log('reset')
}
bim_app_window.prototype.GetOption = function(){
  console.log(this.option)
  return this.option
}
bim_app_window.prototype.SetAuth = function(value){
  this.auth = value
}
bim_app_window.prototype.ShowList = function(which, succes_callback, err_callcack, info){
  switch(which)
  {
    case 'post':
      this.GetPostList()
      break
    case 'form':
      this.GetFormTemplateList()
      break
    case 'device':
      this.GetDeviceList()
      break
    case 'cpn':
      this.GetCpnList()
      break
    case 'cpn-type':
      this.GetCpnTypeList()
      break
    case 'sdl':
      this.GetSdlList()
      break
    case 'assign':
      this.GetAssignList(info);
      break;
    case 'history':
      this.GetFormList()
      break
    case 'member':
      this.GetStaffList()
      break
    default:
      alert("輸入參數錯誤 Check At api.js script Line: 99 ")
      break
  }
  this.Send(null, succes_callback, err_callcack)
}
bim_app_window.prototype.Add = function (which, info, succes_callback, err_callcack){
  switch (which) {
    case 'post':
      this.AddPost()
      break;
    case 'form':
      this.AddFormTemplate()
      break;
    case 'sdl':
      this.AddSdl();
      break;
    case 'assign':
      this.AssignForm();
      break;
    case 'device':
      this.AddDevice();
      break;
    case 'info':
      this.AddCpn();
      break;
    case 'cpn-type':
      this.AddCpnType();
      break;
    case 'member':
      this.AddUser();
      break;
  }
  this.Send(info, succes_callback, err_callcack)
}
bim_app_window.prototype.Update = function (which, id, info, succes_callback, err_callcack){
  switch (which) {
    case 'post':
      this.UpdatePost(id)
      break;
    case 'form':
      this.UpdateFormTemplate(id)
      break;
    case 'sdl':
      this.UpdateSdl(id)
      break;
    case 'assign':
      this.UpdateAssignForm(id)
      break;
    case 'device':
      this.UpdateDevice(id)
      break;
    case 'info':
      this.UpdateCpn(id)
      break;
    case 'cpn-type':
      this.UpdateCpnType(id)
      break;
    case 'member':
      this.UpdateUser(id)
      break;
  }
  this.Send(info, succes_callback, err_callcack)
}
bim_app_window.prototype.Remove = function (which, id, succes_callback, err_callcack){
  switch (which) {
    case 'post':
      this.RemovePost(id)
      break;
    case 'form':
      this.RemoveFormTemplate(id)
      break;
    case 'sdl':
      this.RemoveSdl(id)
      break;
    case 'assign':
      this.RemoveAssignForm(id)
      break;
    case 'device':
      this.RemoveDevice(id)
      break;
    case 'info':
      this.RemoveCpn(id)
      break;
    case 'cpn-type':
      this.RemoveCpnType(id)
      break;
    case 'member':
      this.RemoveUser(id)
      break;
    default:
      alert('which is not define at api.js LINE: 181')
      break
  }
  this.Send(null, succes_callback, err_callcack)
}
//////////////////////////////////////登入///////////////////////////////////////////
bim_app_window.prototype.Login = function(info, succes_callback, err_callcack){
  this.api  = 'staff/'  
  this.op   = 'login'
  this.how  = 'POST'   
  this.Send(info, succes_callback, err_callcack)
}
bim_app_window.prototype.Logout = function(){
  this.api  = 'staff/'
  this.op   = 'logout'
  this.how  = 'DELETE'  
  this.Send(null, function(msg){
    console.log(msg)
    let a = document.createElement('a')
    a.href = 'login.html'
    a.click()
  })
}
//////////////////////////////////////工作人員操作///////////////////////////////////////////
bim_app_window.prototype.AddUser = function(){
  this.api  = 'admin/staff/'
  this.op   = 'add'
  this.how  = 'POST' 
}
bim_app_window.prototype.UpdateUser = function(id){
  this.api  = 'admin/staff/'
  this.op   = 'update?id=' + id 
  this.how  = 'POST'  
}
bim_app_window.prototype.RemoveUser = function(id){
  this.api  = 'admin/staff/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
bim_app_window.prototype.GetStaffList = function(){
  this.api  = 'admin/staff/'
  this.op   = 'list'
  this.how  = 'GET'
}
//////////////////////////////////////表單操作///////////////////////////////////////////
bim_app_window.prototype.GetFormTemplateList = function () {
  this.api  = 'form/template/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AddFormTemplate = function(){
  this.api  = 'admin/form/template/'
  this.op   = 'add'
  this.how  = 'POST' 
}
bim_app_window.prototype.UpdateFormTemplate = function(id){
  this.api  = 'admin/form/template/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
bim_app_window.prototype.RemoveFormTemplate = function(id){
  this.api  = 'admin/form/template/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
bim_app_window.prototype.GetFormList = function(){
  this.api  = 'form/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AssignForm = function(){
  this.api  = 'admin/form/'
  this.op   = 'assign'
  this.how  = 'POST'
}
bim_app_window.prototype.UpdateAssignForm = function (id) {
  this.api  = 'admin/form/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
bim_app_window.prototype.RemoveAssignForm = function (id) {
  this.api  = 'admin/form/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
bim_app_window.prototype.GetAssignList = function(id){
  this.api  = 'form/notification/'
  this.op   = 'list?staff_id=' + id
  this.how  = 'GET'
}
bim_app_window.prototype.RemoveNotification = function(id){
  this.api = '/admin/form/'
  this.op  = 'remove?id=' + id
  this.how = 'DELETE'
}
//////////////////////////////////////設備操作///////////////////////////////////////////
bim_app_window.prototype.GetDeviceList = function(){
  this.api  = 'device/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AddDevice = function(){
  this.api = 'admin/device/'
  this.op  = 'add'
  this.how = 'POST'
}
bim_app_window.prototype.RemoveDevice = function(id){
  this.api  = 'admin/device/'
  this.op   = 'remove?id=' + id 
  this.how  = 'DELETE'
}
bim_app_window.prototype.UpdateDevice = function(id){
  this.api  = 'admin/device/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
//////////////////////////////////////公佈欄操作///////////////////////////////////////////
bim_app_window.prototype.GetPostList = function(){
  this.api  = 'post/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AddPost = function(){
  this.api  = 'admin/post/'
  this.op   = 'add'
  this.how  = 'POST'
}
bim_app_window.prototype.UpdatePost = function(id){
  this.api  = 'admin/post/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
bim_app_window.prototype.RemovePost = function(id){
  this.api  = 'admin/post/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
//////////////////////////////////////零件操作///////////////////////////////////////////
bim_app_window.prototype.GetCpnList = function(){
 this.api   = 'component/'
 this.op    = 'list'
 this.how   = 'GET'
}
bim_app_window.prototype.AddCpn = function(){
  this.api  = 'admin/component/'
  this.op   = 'add'
  this.how  = 'POST'
}
bim_app_window.prototype.RemoveCpn = function(id){
  this.api  = 'admin/component/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
bim_app_window.prototype.UpdateCpn = function(id){
  this.api  = 'admin/component/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
bim_app_window.prototype.GetCpnTypeList = function(){
  this.api  = 'component_type/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AddCpnType = function(){
  this.api  = 'admin/component_type/'
  this.op   = 'add'
  this.how  = 'POST'
}
bim_app_window.prototype.UpdateCpnType = function(id){
  this.api  = 'admin/component_type/'
  this.op   = 'update?id=' + id
  this.how  = 'POST'
}
bim_app_window.prototype.RemoveCpnType = function(id){
  this.api  = 'admin/component_type/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
//////////////////////////////////////行程操作///////////////////////////////////////////
bim_app_window.prototype.GetSdlList = function(){
  this.api  = 'schedule/'
  this.op   = 'list'
  this.how  = 'GET'
}
bim_app_window.prototype.AddSdl = function(){
  this.api  = 'admin/schedule/'
  this.op   = 'add'
  this.how  = 'POST'
}
bim_app_window.prototype.RemoveSdl = function(id){
  this.api  = 'admin/schedule/'
  this.op   = 'remove?id=' + id
  this.how  = 'DELETE'
}
bim_app_window.prototype.UpdateSdl = function(id){
  this.api  = 'admin/schedule/'
  this.op   = 'update?id=' + id 
  this.how  = 'POST'
}
bim_app_window.bim = new bim_app_window()//static 