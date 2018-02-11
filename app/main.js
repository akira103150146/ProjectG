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
var bim = new api()
var auth

app.on('ready', function(){  
  win = new BrowserWindow({width: 1920, height: 1080})
  result_win = new BrowserWindow({width: 800, height: 600 , parent: win, modal: true, show: false}) 
  win.loadURL('file://' + __dirname + '/index.html')
  result_win.loadURL('file://' + __dirname + '/result.html')
 
  win.webContents.openDevTools()
  result_win.webContents.openDevTools();
  
  win.on('closed', () => { win = null})
  result_win.on('closed', () => { result_win = null})

  ipcMain.on('login', (event,arg,arg2)=>{    
    console.log(arg)
    console.log(arg2)
   /* bim.Login(arg,arg2) 
    rp(bim.GetOption()).then((parseBody)=>{
      console.log(parseBody)
      if(parseBody['code'] == 100){
        var id = parseBody['content'].id
        var token = parseBody['content'].token
        auth = id + '_' + token     
        bim.SetAuth(auth)
        win.loadURL('file://' + __dirname + '/member.html')
      }
      else{
        alert('帳號或密碼錯誤')
      }
      bim.Reset()
    }).catch((err)=>{
      console.log(err)
    })   */
    win.loadURL('file://' + __dirname + '/form.html')     
  }) 
  ipcMain.on('logout',()=>{
    bim.Logout()
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      bim.Reset()
      win.loadURL('file://' + __dirname + '/index.html')
    }).catch((err) => {
      console.log(err)
    })   
  })
  ipcMain.on('toggle-result', ()=>{
    console.log('call')
    if(result_win.isVisible())
      result_win.hide()
    else
      result_win.show()
  })
  ipcMain.on('add',(event,which,body)=>{
    if(which === 'member'){
      bim.AddUser(body)
    }
    else if(which === 'device'){
      bim.AddDevice(body)
    }
    else{
      alert('type error!')
    }
    console.log('add-member')
   
    rp(bim.GetOption()).then((parseBody)=>{
      console.log(parseBody)      
      bim.Reset()
    }).catch((err)=>{
      console.log(err)
    })   
  })
  ipcMain.on('remove-member',(event,arg)=>{
    console.log('remove')
    bim.RemoveUser(arg)
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      bim.Reset()
    }).catch((err) => {
      console.log(err)
    })  
    
  })
  ipcMain.on('ready-to-show',(event,which)=>{
    console.log('ready-to-show')
    let back_path = ''
    if(which === 'member'){
      bim.GetStaffList()
      back_path = 'reply-member'
    }
    else if(which === 'device'){
      bim.GetDeviceList()
      back_path = 'reply-device'
    }
    else{
      alert('type error!')
    }
    rp(bim.GetOption()).then((parseBody)=>{
      //console.log(parseBody)  
      event.sender.send(back_path,parseBody['content'])     
      bim.Reset()
    }).catch((err)=>{
      console.log(err)
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
  console.log('e')
})