"use strict";

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;

var win
var menu = new Menu();

function buildMenu()
{
  menu.append(new MenuItem({ label: 'MenuItem1', 
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ],
  click() { console.log('item 1 clicked') } }))
  menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
 
})

app.on('ready', () => {
  //buildMenu();
  win = new BrowserWindow({ width: 1920, height: 1080 })
  //win.setMenu(null);
  win.loadURL(`file://${__dirname}/src/login.html`)
  win.on('closed', () => { win = null })

})
