"use strict";

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var win

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
 
})

app.on('ready', () => {
  win = new BrowserWindow({ width: 1920, height: 1080 })
  win.loadURL(`file://${__dirname}/src/login.html`)
  win.on('closed', () => { win = null })

})
