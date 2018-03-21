const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
const api = require('./js/lib/api.js');
const rp = require('request-promise');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win
var result_win
var auth
const bim = new api()

app.on('ready', function(){  
  win = new BrowserWindow({width: 1920, height: 1080})
  result_win = new BrowserWindow({width: 800, height: 600 , parent: win, modal: true, show: false}) 
  win.loadURL('file://' + __dirname + '/index.html')
  result_win.loadURL('file://' + __dirname + '/bind_device.html')
 
  win.webContents.openDevTools()
  result_win.webContents.openDevTools();
  
  win.on('closed', () => { win = null})
  result_win.on('closed', () => { result_win = null})
  ipcMain.on('switch_page',(event,index)=>{
    let pagename = ['/bagi.html','/setting.html','/form.html','/member.html','/info.html','/post.html','/history.html','/assign.html']
    //console.log(index)
    //console.log(pagename[index])
    win.loadURL('file://' + __dirname + pagename[index])
  })
  ipcMain.on('login', (event,arg,arg2)=>{   
    bim.Login(arg,arg2) 
    rp(bim.GetOption()).then((parseBody)=>{      
      if(parseBody['code'] == 100){
        var id = parseBody['content'].id
        var token = parseBody['content'].token
        auth = id + '_' + token     
        bim.SetAuth(auth)
        win.loadURL('file://' + __dirname + '/post.html')
      }
      else{
        console.log('帳號或密碼錯誤')
      }
      bim.Reset()
    }).catch((err)=>{
      //console.log(err)
    })   
    //win.loadURL('file://' + __dirname + '/member.html')     
  }) 
  ipcMain.on('logout',()=>{
    bim.Logout()
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      bim.Reset()
      win.loadURL('file://' + __dirname + '/index.html')
    }).catch((err) => {
      //console.log(err)
    })   
  })
  ipcMain.on('toggle-result', function(event,which,data){
    console.log('call')
    if(result_win.isVisible()){    
      win.webContents.send('bind_devices', data)//送綁定資料到main window
      result_win.hide()     
    }
    else{
      result_win.show()
      result_win.reload()
    }
   
  })
  ipcMain.on('update', (event, which, id, body, tag) => {
    console.log('update')
    console.log('tag :' + tag)
    if (which === 'member') {
      bim.UpdateUser(id, body)
    }
    else if (which === 'device') {
      bim.UpdateDevice(id, body)
    }
    else if(which === 'form'){
      bim.UpdateFormTemplate(id,body)
    }
    else if(which === 'post'){
      bim.UpdatePost(id,body)
    }
    else {
      console.log('which is not defined !')
    }

    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)      
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
    })   
  })
  ipcMain.on('add',(event, which, body, tag)=>{
    console.log('add')
    console.log('tag :' + tag)
    let path = ''

    if(which === 'member'){
      bim.AddUser(body)
      path = 'updatecell-member'
    }
    else if(which === 'device'){
      bim.AddDevice(body)
      path = 'updatecell-device'
    }
    else if(which === 'form'){
      bim.AddFormTemplate(body)
      path = 'update-form'
    }
    else if(which === 'post'){
      bim.AddPost(body)
      path = 'update-post'
    }
    else if(which === 'assign'){
      bim.Assign_Form(body)
    }
    else{
      console.log('which is not defined')
      console.log(which)
    }   
    rp(bim.GetOption()).then((parseBody)=>{
      console.log(parseBody)    
      event.sender.send(path,parseBody.content,tag)
      bim.Reset()
    }).catch((err)=>{
      //console.log(err)
    })   
  })
  ipcMain.on('remove',(event,which,body)=>{
    console.log('remove')
    console.log(which)
    if (which === 'member') {
      bim.RemoveUser(body)
    }
    else if (which === 'device') {
      bim.RemoveDevice(body)
    }
    else if(which === 'form'){
      bim.RemoveFormTemplate(body)
    }
    else if(which === 'post'){
      bim.RemovePost(body)
    }
    else {
      console.log('which is not defined')
      console.log(which)
    }  
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
    })  
    
  })
  ipcMain.on('ready-to-show',(event,which)=>{
    console.log('ready-to-show')
    let back_path = ''
    if(which === 'member'){
      console.log('ready-member')
     
      bim.GetStaffList()
      back_path = 'reply-member'
    }
    else if(which === 'device'){
      console.log('ready-device')
      bim.GetDeviceList()
      back_path = 'reply-device'
    }
    else if(which === 'form'){
      bim.GetFormTemplateList()
      back_path = 'reply-form'
    }
    else if(which === 'history'){
      bim.GetFormList()
      back_path = 'reply-history'
    }
    else if(which ==='post'){
      bim.GetPostList()
      back_path = 'reply-post'
    }
    else{
      console.log('which is not defined')
      console.log(which)
    }
    rp(bim.GetOption()).then((parseBody)=>{
      console.log(parseBody)  
      event.sender.send(back_path,parseBody['content'])     
      bim.Reset()
    }).catch((err)=>{
      //console.log(err)
    }) 
    
  })
})


app.on('window-all-closed', () => {  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => { 
  if (win === null) {
    createWindow()
  } 
})