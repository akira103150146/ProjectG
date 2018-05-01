"use strict";
function sidebar_setup(type){
    let content_name = ['公佈欄', '巡檢表單編輯', '巡檢設備設定', '巡檢任務派遣', '維修主配件庫存查詢', '運維歷史表單查詢', '巡檢人員帳戶設定']
    let ids          = ['post', 'form', 'setting', 'bagi', 'info', 'histroy', 'member']
    let iname = ['format list bulleted', 'mode edit', 'devices', 'assignment', 'storage', 'history', 'assignment ind']
    const pagename = ['assign.html', 'setting.html', 'form.html', 'member.html', 'info.html', 'post.html', 'history.html']
    let a = document.createElement('a')
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
        $('#sidebar-option').append(l)
        $('#sidebar-option').append(ic)
    }
    $('#user-name')[0].textContent = localStorage.getItem('user-name') 
    $('#bagi').on('click', () => {
        a.href = pagename[0]
        a.click()
    })
    $('#setting').on('click', () => {
        a.href = pagename[1]
        a.click()
    })
    $('#form').on('click', () => {
        a.href = pagename[2]
        a.click()
    })
    $('#member').on('click', () => {
        a.href = pagename[3]
        a.click()
    })
    $('#info').on('click', () => {
        a.href = pagename[4]
        a.click()
    })
    $('#post').on('click', () => {
        a.href = pagename[5]
        a.click()
    })
    $('#histroy').on('click', () => {
        a.href = pagename[6]
        a.click()
    })
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('#close_btn').on('click', () => {
        $('#sidebar').toggleClass('active');
    })
    $('#logout_btn').click(function () {
        bim_app_window.bim.Logout()
    })

}