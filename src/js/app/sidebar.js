"use strict";
function sidebar_setup(type){
    let content_name = ['公佈欄', '巡檢表單編輯', '巡檢設備設定', '巡檢任務派遣', '維修主配件庫存查詢', '運維歷史表單查詢', '巡檢人員帳戶設定']
    let ids          = ['post', 'form', 'setting', 'bagi', 'info', 'histroy', 'member']
    let iname = ['format list bulleted', 'mode edit', 'devices', 'assignment', 'storage', 'history', 'assignment ind']
    for(let i=0;i<7;i++){
        let l   = document.createElement('li')
        let a   = document.createElement('a')
        let ic  = document.createElement('i') 
        a.id = ids[i]
        a.textContent   = content_name[i]
        ic.className    = 'material-icons'
        ic.textContent  = iname[i]
        if(type === ids[i])
            l.className = 'active'
        l.appendChild(a)
        l.appendChild(ic)
        $('#sidebar-option').append(l)
    }
    $('#user-name')[0].textContent = localStorage.getItem('user-name') 
    $('#bagi').on('click', () => {
        ipcrender.send('switch_page', 0)
    })
    $('#setting').on('click', () => {
        ipcrender.send('switch_page', 1)
    })
    $('#form').on('click', () => {
        ipcrender.send('switch_page', 2)
    })
    $('#member').on('click', () => {
        ipcrender.send('switch_page', 3)
    })
    $('#info').on('click', () => {
        ipcrender.send('switch_page', 4)
    })
    $('#post').on('click', () => {
        ipcrender.send('switch_page', 5)
    })
    $('#histroy').on('click', () => {
        ipcrender.send('switch_page', 6)
    })
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('#close_btn').on('click', () => {
        $('#sidebar').toggleClass('active');
    })
    $('#logout_btn').click(function () {
        ipcrender.send('logout')
    })

}