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
    })
  })

  ///////////////////////////////////////////////////////登出//////////////////////////////////////////////////////
  ipcMain.on('logout', () => {
    bim.Logout()
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      bim.Reset()
      win.loadURL(`file://${__dirname}/src/login.html`)
    }).catch((err) => {
      //console.log(err)
    })
  })

  ///////////////////////////////////////////////////////開啟小視窗//////////////////////////////////////////////////////
  ipcMain.on('toggle-result', function (event, which, data) {
    console.log('call')
    if (!result_win) {
      result_win = new BrowserWindow({ width: 800, height: 600, parent: win, modal: true, show: false })
      result_win.loadURL('file://' + __dirname + '/bind_device.html')
      result_win.webContents.openDevTools()
      result_win.on('closed', () => { result_win = null })
    }
    if (result_win.isVisible()) {
      if (which === 'bind')
        win.webContents.send('bind_devices', data)//送綁定資料到main window
      result_win.hide()
    }
    else {
      result_win.webContents.send('update-bind-list', data)//送綁定資料到sub window
      result_win.show()
      result_win.reload()
    }

  })

  ///////////////////////////////////////////////////////更新//////////////////////////////////////////////////////
  ipcMain.on('update', (event, which, id, body, tag) => {
    console.log('update')
    console.log('tag :' + tag)
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
    else if (which === 'Sdl') {
      bim.UpdateSdl(id, body)
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
      bim.Assign_Form(body)
    }
    else if (which === 'info') {
      bim.AddCpn(body)
    }
    else if (which === 'Cpn-type') {
      bim.AddCpnType(body)
      path = 'update-Cpn-type'
    }
    else if (which === 'Sdl') {
      bim.AddSdl(body)
      path = 'update-Sdl'
    }
    else {
      console.log('which is not defined')
      console.log(which)
    }
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      event.sender.send(path, parseBody.content, tag)
      bim.Reset()
    }).catch((err) => {
      //console.log(err)
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

  ///////////////////////////////////////////////////////顯示網頁//////////////////////////////////////////////////////
  ipcMain.on('ready-to-show', (event, which) => {
    console.log('ready-to-show')
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
    else {
    }
    rp(bim.GetOption()).then((parseBody) => {
      console.log(parseBody)
      event.sender.send(back_path, parseBody['content'])
      bim.Reset()
    }).catch((err) => {
      console.log(err)
    })

  })
})