
/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};
var current_select_form_index = 0
var loc_id = 0
// REDIPS.table initialization
redips.init = function () {
    // define reference to the REDIPS.table object
    var rt = REDIPS.table;
    // activate onmousedown event listener on cells within table with id="mainTable"
    rt.onmousedown('mainTable', true);
    // show cellIndex (it is nice for debugging)
    //rt.cell_index(true);
    // define background color for marked cell
    rt.color.cell = '#9BB3DA';   
};

// function merges table cells
redips.merge = function () {
    // first merge cells horizontally and leave cells marked
    REDIPS.table.merge('h', false);
    // and then merge cells vertically and clear cells (second parameter is true by default)
    REDIPS.table.merge('v');
};

// function splits table cells if colspan/rowspan is greater then 1
// mode is 'h' or 'v' (cells should be marked before)
redips.split = function (mode) {
    REDIPS.table.split(mode);   
};

// insert/delete table row
redips.row = function (type) {
    REDIPS.table.row('mainTable', type);    
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

redips.showlist = function(info){
    let init_to_show
    let jstring = JSON.stringify(info)
    localStorage.setItem('list_content',jstring)//將表單資料全部丟進去 local
    $('#form-list')[0].innerHTML = '<option disabled selected value> -- select an option -- </option>'
    const l = info.length
    for(let i=0;i<l;i++){//將表單資料撈出來 新增list項目       
        const index = info[i].id
        const title = info[i].title
        if(i === 0){
            init_to_show = index
            current_select_form_index = index
        }
        redips.insert_op(index, title)        
    }
    this.showform(init_to_show)
}

redips.insert_op = function(id,title){
    let formlist = document.getElementById('form-list')
    let op = document.createElement('option')
    if(id != null){
        op.setAttribute('id', id)
    }
    op.textContent = title
    formlist.appendChild(op)
}

redips.showform = function(id){
    let item = this.findform(id)
    if(item)
        redips.fillform(item)
    else 
        alert('item not found!')   
}

redips.fillform = function(item){
    let table = document.getElementById('mainTable')
    let ID = document.getElementById('ID')
    let title = document.getElementById('title')
    let date = document.getElementById('date') 
    let bind_list = document.getElementById('bind-list')
    ID.value = item.id
    table.innerHTML = item.content
    title.value = item.title
   
    if(bind_list){
        bind_list.innerHTML = ''
        item.deviceIds.forEach((e)=>{
            let temp = document.createElement('option')
            temp.textContent = e
            bind_list.appendChild(temp)
        })
    }
    else{
        $('#mainTable td').each((index, e) => {
            e.contentEditable = false;
        })
    }
    if(item.createTime)
        date.value = new Date(item.createTime).toDateString()
    else
        date.value = new Date(item.submitTime).toDateString()
    redips.init()
}

redips.findform = function(index){

    const obj = JSON.parse(localStorage.list_content)
    console.log(obj)
    const result = obj.filter( x=> x.id == index)

    if(result.length > 0)
        return result[0]
    else
        return null
}

redips.addform = function(){    
    let tb = document.createElement('tbody')
    let tr = document.createElement('tr')
    for (let count = 0; count < 6; count++) {
        let td = document.createElement('td')
        td.setAttribute('contentEditable', true)
        tr.appendChild(td)
    }
    tb.appendChild(tr)

    let item = {
        'id': 'loc_' + loc_id.toString(),
        'content' : tb.innerHTML,
        'title': 'I am A Title',
        'createTime': '',
        'deviceIds': []
    }    
    redips.insert_op(item.id, item.title)//add list
    redips.add_to_json(item)//add to json
    document.getElementById(item.id).click()
    loc_id++    
}

redips.saveform = function () {
    let content = redips.get_loc_formdata()
    let ID = document.getElementById('ID')

    if (ID.value.substr(0,3) === 'loc') { // do add
        ipcrender.send('add','form',content,ID.value)
    }
    else { // do update
        ipcrender.send('update', 'form', ID.value, content, ID.value)
    }  
}

redips.get_loc_formdata = function(){
    const table = document.getElementById('mainTable')
    const title = document.getElementById('title')
    const ID = document.getElementById('ID')
    const date = document.getElementById('date')
    let content = {
        'id': ID.value,
        'title': title.value,
        'content': table.innerHTML,
        'deviceIds': this.get_bind_arr(),
        'createTime': date.value
    }

    return content
}
redips.get_bind_arr = function(){
    let arr = []
    
    $('#bind-list option').each(
        function(e){
           arr.push(this.textContent)
        }
    )
    return arr
}
redips.updateform = function(content,tag){  
   let li = document.getElementById(tag) //update li id
   li.setAttribute('id',content.id)
   redips.update_to_json(tag,content)//add to json file
   redips.fillform(content)
}

redips.add_to_json = function(content){
    let obj = JSON.parse(localStorage.list_content)
     obj.push(content)
     localStorage.list_content = JSON.stringify(obj)
}

redips.update_to_json = function(id,content){
    let obj = JSON.parse(localStorage.list_content)
    const l = obj.length
    for(let i =0;i<l;i++){
        if(obj[i].id == id){
            obj[i] = content
        }
    }
    localStorage.list_content = JSON.stringify(obj)
}

redips.remove_from_json = function(id){   
    let obj = JSON.parse(localStorage.list_content)
    let index = obj.map(x=>x.id.toString()).indexOf(id.toString())
    
    if(index > -1 && index < obj.length){
        obj.splice(index, 1)
    }
    else{
        alert('remove item not found!')
    }
}

redips.removeform = function(){
    let table = document.getElementById('mainTable')
    let ID = document.getElementById('ID')
    let title = document.getElementById('title')
    let date = document.getElementById('date')

    if(ID.value != null){      
        let id = ID.value
        let item = document.getElementById(id)
        ipcrender.send('remove','form',id)         
        item.parentNode.removeChild(item)
        redips.remove_from_json(id)        
        table.innerHTML = ''
        ID.value = ''
        date.value = ''
        $('#bind-list li').each(
            function (e) {
               this.parentNode.removeChild(this)
            }
        )
       
    }
}

redips.bind_device = function(){
    console.log('open sub window')    
    $('#myModal')[0].style.display = "block";
}