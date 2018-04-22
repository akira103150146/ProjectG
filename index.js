/* eslint strict: 0 */
"use strict";
const electron = require('electron');
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
const api = require('./src/js/lib/api.js');
const rp = require('request-promise');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
const dialog = require('electron').dialog
let menu;
let template;
let mainWindow = null;
const bim = new api()
let lastpages = []
const pagename = ['/assign.html', '/setting.html', '/form.html', '/member.html', '/info.html', '/post.html', '/history.html']
let auth
let win
let result_win
//crashReporter.start();
const fs = require('fs')



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // if (win === null) {
  //   createWindow()
  // }
})

app.on('ready', () => {
  win = new BrowserWindow({ width: 1920, height: 1080 })
  result_win = new BrowserWindow({ width: 800, height: 600, parent: win, modal: true, show: false }) 

  win.loadURL(`file://${__dirname}/src/login.html`)
  win.on('closed', () => { win = null })
  result_win.on('closed', () => { result_win = null })

  ///////////////////////////////////////////////////////切換網頁//////////////////////////////////////////////////////
  ipcMain.on('switch_page', (event, index) => {
    lastpages.push(index)
    win.loadURL(`file://${__dirname}/src/${pagename[index]}`)
  })
  ipcMain.on('last_page', (event) => {
    win.loadURL(`file://${__dirname}/src/${pagename[5]}`)
  })

  ///////////////////////////////////////////////////////登入//////////////////////////////////////////////////////
  ipcMain.on('login', (event, arg, arg2) => {
    bim.Login(arg, arg2)

    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody['code'])
      if (parseBody['code'] == 100) {
        var id = parseBody['content'].id
        var token = parseBody['content'].token
        auth = id + '_' + token
        fs.appendFile('log.txt', new Date().toDateString() + '\n' +  'Login' + '\n' +
          '帳號: ' + arg + '\n' + '密碼: ' + arg2 + '\n' + '--------------------------------------- \n', 
          function (err) {
            if (err)
              return console.log(err);
            console.log('Wrote Hello World in file helloworld.txt, just check it');
          })
        
        bim.SetAuth(auth)
        win.webContents.send('reply-login', id, arg)//初始化使用者資料
        win.loadURL(`file://${__dirname}/src/post.html`)
        //result_win.loadURL('file://' + __dirname + '/bind_device.html')
      }
      else {
        console.log('帳號或密碼錯誤')
      }
      bim.Reset()
    }).catch((err) => {
      console.log(err)
      dialog.showErrorBox("登入", "伺服器錯誤")
    })
  })

  ///////////////////////////////////////////////////////登出//////////////////////////////////////////////////////
  ipcMain.on('logout', () => {
    bim.Logout()
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      fs.appendFile('log.txt', new Date().toDateString() + '\n' + 'Logout \n' + '--------------------------------------- \n' , function (err) {
          if (err)
            return console.log(err);
          console.log('Wrote Hello World in file helloworld.txt, just check it');
        })
      bim.Reset()
      win.loadURL(`file://${__dirname}/src/login.html`)
    }).catch((err) => {
      //console.log(err)
      dialog.showErrorBox("登出", "伺服器錯誤")
    })
  })
  ///////////////////////////////////////////////////////新增//////////////////////////////////////////////////////
  ipcMain.on('add', (event, which, body, tag) => {
    console.log('add')
    console.log('tag :' + tag)
    let path = ''

    if (which === 'member') {
      bim.AddUser(body)
      path = 'updatecell-member'
    }
    else if (which === 'device') {
      bim.AddDevice(body)
      path = 'updatecell-device'
    }
    else if (which === 'form') {
      bim.AddFormTemplate(body)
      path = 'update-form'
    }
    else if (which === 'post') {
      bim.AddPost(body)
      path = 'update-post'
    }
    else if (which === 'assign') {
      bim.AssignForm(body)
    }
    else if (which === 'info') {
      bim.AddCpn(body)
      path = 'update-Cpn'
    }
    else if (which === 'Cpn-type') {
      bim.AddCpnType(body)
      path = 'update-Cpn-type'
    }
    else if (which === 'sdl') {
      bim.AddSdl(body)
      path = 'update-Sdl'
    }
    else {
      console.log('which is not defined')
      console.log(which)
    }
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      if(path != '')
        event.sender.send(path, parseBody.content, tag)
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
      dialog.showErrorBox("新增資料", "伺服器錯誤!" + err)
    })
  })
  
  ///////////////////////////////////////////////////////更新//////////////////////////////////////////////////////
  ipcMain.on('update', (event, which, id, body, id2, body2) => { //id2 和 body2只用在更新派遣任務 其餘都是null 不會有值
    console.log('update')
    console.log('tag :' + id)
    console.log(body)
    if (which === 'member') {
      bim.UpdateUser(id, body)
    }
    else if (which === 'device') {
      bim.UpdateDevice(id, body)
    }
    else if (which === 'form') {
      bim.UpdateFormTemplate(id, body)
    }
    else if (which === 'post') {
      bim.UpdatePost(id, body)
    }
    else if (which === 'info') {
      bim.UpdateCpn(id, body)
    }
    else if (which === 'sdl') {
      bim.UpdateSdl(id, body)
    }
    else if (which === 'Cpn-type') {
      bim.UpdateCpnType(id, body)
    }
    else {
      console.log('which is not defined !')
    }

    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      if(which === 'sdl'){  //更新行程的時候同時也要更新派遣的任務
        bim.Reset()
        bim.UpdateAssignForm(id2, body2)
        rp(bim.GetOption()).then((parseBody) =>{
          console.log(parseBody)
        }).catch((err) =>{
          dialog.showErrorBox("更新", "伺服器錯誤!" + err)
        })
      }
      
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
      dialog.showErrorBox("更新", "伺服器錯誤!" + err)
    })
  })
  ///////////////////////////////////////////////////////刪除//////////////////////////////////////////////////////
  ipcMain.on('remove', (event, which, body) => {
    console.log('remove')
    console.log(which)
    if (which === 'member') {
      bim.RemoveUser(body)
    }
    else if (which === 'device') {
      bim.RemoveDevice(body)
    }
    else if (which === 'form') {
      bim.RemoveFormTemplate(body)
    }
    else if (which === 'post') {
      bim.RemovePost(body)
    }
    else if (which === 'info') {
      bim.RemoveCpn(body)
    }
    else if(which === 'sdl'){
      bim.RemoveSdl(body)
    }
    else if (which === 'Cpn-type') {
      bim.RemoveCpnType(body)     
    }
    else if (which === 'notify'){
      bim.RemoveNotification(body)
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
      dialog.showErrorBox("刪除", "伺服器錯誤!" + err)
    })

  })

  ///////////////////////////////////////////////////////顯示網頁//////////////////////////////////////////////////////
  ipcMain.on('ready-to-show', (event, which, arg1) => {
    console.log('ready-to-show' + which)
    let back_path = ''
    if (which === 'member') {
      console.log('ready-member')
      bim.GetStaffList()
      back_path = 'reply-member'
    }
    else if (which === 'device') {
      console.log('ready-device')
      bim.GetDeviceList()
      back_path = 'reply-device'
    }
    else if (which === 'form') {
      bim.GetFormTemplateList()
      back_path = 'reply-form'
    }
    else if (which === 'history') {
      bim.GetFormList()
      back_path = 'reply-history'
    }
    else if (which === 'post') {
      bim.GetPostList()
      back_path = 'reply-post'
    }
    else if (which === 'Cpn-type') {
      bim.GetCpnTypeList()
      back_path = 'reply-Cpn-type'
    }
    else if (which === 'Cpn') {
      bim.GetCpnList()
      back_path = 'reply-Cpn'
    }
    else if (which === 'Sdl') {
      bim.GetSdlList()
      back_path = 'reply-Sdl'
    }
    else if(which === 'notify'){
      console.log(arg1)
      bim.GetAssignList(arg1)
      console.log(bim.GetOption())
      back_path = 'reply-notify'
    }
    else {
    }
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      event.sender.send(back_path, parseBody['content'])
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
      dialog.showErrorBox("顯示","伺服器錯誤!" + err)
    })

  })
})
