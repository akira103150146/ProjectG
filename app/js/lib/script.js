/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};
var current_select_form_index = 0
var ipcrender_form = require('electron').ipcRenderer
// REDIPS.table initialization
redips.init = function () {
    // define reference to the REDIPS.table object
    var rt = REDIPS.table;
    // activate onmousedown event listener on cells within table with id="mainTable"
    rt.onmousedown('mainTable', true);
    // show cellIndex (it is nice for debugging)
    rt.cell_index(true);
    // define background color for marked cell
    rt.color.cell = '#9BB3DA';    
    console.log('init');  
};


// function merges table cells
redips.merge = function () {
    // first merge cells horizontally and leave cells marked
    REDIPS.table.merge('h', false);
    // and then merge cells vertically and clear cells (second parameter is true by default)
    REDIPS.table.merge('v');
    console.log('merge');
};


// function splits table cells if colspan/rowspan is greater then 1
// mode is 'h' or 'v' (cells should be marked before)
redips.split = function (mode) {
    REDIPS.table.split(mode);   
    console.log('split');
};


// insert/delete table row
redips.row = function (type) {
    REDIPS.table.row('mainTable', type);    
    console.log('insert row');
    var debugmsg = document.getElementById('mainTable')   
    var rows =  debugmsg.rows;
};


// insert/delete table column
redips.column = function (type) {
    REDIPS.table.column('mainTable', type);    
};


// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
    window.attachEvent('onload', redips.init);
}


redips.save = function(){
    const table  = document.getElementById('mainTable')
    const title = document.getElementById('title')
    const ID = document.getElementById('ID')
    let content = {
        'title': '',
        'content': '',
        'deviceIds':''
    }

    if(ID === ''){ // do add
        ipcrender_form.send('add',content)
    }
    else{ // do update
        ipcrender_form.send('update',content, ID.value)
    }
    console.log(table.innerHTML)
}

redips.showlist = function(info){
    let formlist = document.getElementById('form-list')
    const l = info.length

    console.log('showlist')
    let jstring = JSON.stringify(info)
    localStorage.setItem('list_content',jstring)
    
    for(let i=0;i<l;i++){
        let li = document.createElement('li')
        li.setAttribute('id',i)
        li.addEventListener('click',()=>{
            const index = li.getAttribute('id')
            redips.showform(index)
            current_select_form_index = index
            console.log('change form')
            console.log(current_select_form_index)
        })
        li.textContent = info[i].title
        formlist.appendChild(li)
    }
    this.showform(0)
}

redips.showform = function(id){
    let table = document.getElementById('mainTable')
    let ID = document.getElementById('ID')
    let title = document.getElementById('title')
    let date = document.getElementById('date')
    //console.log(localStorage.list_content)
    let obj = JSON.parse(localStorage.list_content)
    console.log(obj[id])
    ID.value = obj[id].id
    table.innerHTML = obj[id].content
    title.value = obj[id].title
    date.value = new Date(obj[id].createTime).toDateString()
    redips.init()
}

redips.addform = function(){
    let table = document.getElementById('mainTable')
    let ID = document.getElementById('ID')
    let title = document.getElementById('title')
    let date = document.getElementById('date')

    table.innerHTML = ''
    let tb = document.createElement('tbody')
    let tr = document.createElement('tr')
    for(let count = 0;count<6;count++){
        let td = document.createElement('td')
        td.setAttribute('contentEditable', true)
        tr.appendChild(td)
    }
    tb.appendChild(tr)
    table.appendChild(tb)
    redips.init()
    ID.value = ''
    title.value = 'I am A title'
    date.value = new Date().toDateString()
}

redips.removeform = function(){
    let table = document.getElementById('mainTable')
    let ID = document.getElementById('ID')
    let title = document.getElementById('title')
    let date = document.getElementById('date')
    if(ID.value != null){
       // ipcrender_form.send('remove','form',ID.value)
        console.log(ID.value)
        table.innerHTML = ''
        ID.value = ''
        date.value = ''
        //remove from local storage 
        let jstring =  localStorage.list_content
        let obj = JSON.parse(jstring)
        obj.splice(current_select_form_index,1)
        jstring = JSON.stringify(obj)
        localStorage.list_content = jstring
       // console.log(localStorage.list_content)
        //remove from list
        let r = document.getElementById(current_select_form_index)
        console.log(current_select_form_index)
        console.log(r.parentNode)
        r.parentNode.removeChild(r)
    }

}