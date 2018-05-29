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
   

    sessionStorage.list_content = JSON.stringify(info) 

    $('#form-list')[0].innerHTML = '<option disabled selected value> -- select an option -- </option>'

    const l = info.length

    for(let i=0;i<l;i++){      
        const index = info[i].id
        let title = info[i].title
        if($('#bind-list')) //用來判斷是否是歷史表單
            title = title + "---" + new Date(info[i].submitTime).toLocaleDateString()
        
        if(i == 0){
            redips.showform(index)
            current_select_form_index = index
        }
        redips.insert_op(index, title)        
    }
  
}

redips.insert_op = function(id,title){
    let op = document.createElement('option')
    if(id != null){
        op.setAttribute('id', id)
        op.textContent = title
    }
  
    $('#form-list').append(op)
}

redips.showform = function(id){
    let item = this.findform(id)
    if(item)
        redips.fillform(item)
    else 
        alert('item not found!')   
}

redips.fillform = function(item){
   
    $('#ID').val(item.id);
    $('#title').val(item.title);   
    $('#mainTable')[0].innerHTML = item.content;
    
    let bind_list = document.getElementById('bind-list')

    if(bind_list){
        bind_list.innerHTML = '';
        let list = JSON.parse(sessionStorage.dist_device);
        item.deviceIds.forEach((e)=>{
            let temp = document.createElement('option');
            temp.textContent = list[e];
            temp.id = e ;
            bind_list.appendChild(temp);
        })
        $('#date').val(new Date(item.createTime).toLocaleDateString());
    }
    else{
        $('#mainTable td').each((index, e) => {
            e.contentEditable = false;
        })
        $('#date').val(new Date(item.submitTime).toLocaleDateString());
        $('#images')[0].innerHTML = ''
        console.log($('#images'))
    }
   
    redips.init();
}

redips.findform = function(index){
    let obj 
  
    $('#bind-list') ? obj = JSON.parse(sessionStorage.list_content) : obj = JSON.parse(sessionStorage.list_history)

    const result = obj.filter( x=> x.id == index)

    if(result.length > 0)
        return result[0]
    else
        return null
}

redips.addform = function(){  
 
//#region 創造預設的表單
    let tb = document.createElement('tbody')
    let tr = document.createElement('tr')
    for (let count = 0; count < 6; count++) {
        let td = document.createElement('td')
        td.setAttribute('contentEditable', true)
        tr.appendChild(td)
    }
    tb.appendChild(tr)
//#endregion 創造預設的表單

    let item = {
        'id': 'loc_' + loc_id.toString(),
        'content' : tb.innerHTML,
        'title': '未命名標題' + loc_id,
        'createTime': Date.now(),
        'deviceIds': []
    }    
    redips.insert_op(item.id, item.title)//add list
    redips.add_to_json(item)
    document.getElementById(item.id).click()
    redips.showform(item.id)
    $('#form-list option').filter(function () {
        return $(this).text() == '未命名標題' + loc_id
    }).prop('selected', true)
    loc_id++   
  
}

redips.saveform = function () {
    let content = redips.get_loc_formdata()
    let ID = document.getElementById('ID')
    if (ID.value.substr(0,3) === 'loc') { // do add
        bim_app_window.bim.Add('form', content, function(msg){

            let info = msg['content']
            redips.updateform($('#form-list :selected')[0].id, info) 
            $('#form-list :selected')[0].id = info.id  

            alert('新增成功')       
        })
    }
    else { // do update
        bim_app_window.bim.Update('form', ID.value, content, function(msg){
            let info = msg['content']
            redips.updateform($('#form-list :selected')[0].id, info)
            alert('更新成功')
        })
    }  
    $('#mainTable td').each((index, e) => { //取消所有選取
        REDIPS.table.mark(false, e)
    })
}

redips.updateform = function (id, content) {
    $('#form-list :selected').text(content.title)
    console.log("update id");
    redips.update_to_json(id, content)//add to json file
    redips.fillform(content)
}

redips.update_to_json = function (id, content) {
   
    let obj = JSON.parse(sessionStorage.list_content)
    console.log("before update")
    console.log(obj)
    const l = obj.length
    console.log("search id:  " + id)
    for (let i = 0; i < l; i++) {
        if (obj[i].id == id) {
            obj[i] = content
            console.log("update content--> ")
            console.log(obj[i])
            break
        }
    }
    console.log("after update")
    console.log(obj)
    sessionStorage.list_content = JSON.stringify(obj)
}

redips.get_loc_formdata = function(){

    let content = {
        'id': $('#ID')[0].value,
        'title': $('#title')[0].value,
        'content': $('#mainTable')[0].innerHTML,
        'deviceIds': this.get_bind_arr(),
        'createTime': $('#date')[0].value
    }
    console.log(content)
    return content
}

redips.get_bind_arr = function(){
    let arr = []
    
    $('#bind-list option').each(
        function(){
            arr.push($(this)[0].id)
        }
    )
    return arr
}

redips.add_to_json = function(content){
    let obj = JSON.parse(sessionStorage.list_content)
     obj.push(content)
     sessionStorage.list_content = JSON.stringify(obj)
}

redips.remove_from_json = function(id){   
    let obj = JSON.parse(sessionStorage.list_content)
    let index = obj.map(x=>x.id.toString()).indexOf(id.toString())
    
    if(index > -1 && index < obj.length){
        obj.splice(index, 1)
        sessionStorage.list_content = JSON.stringify(obj)
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
        bim_app_window.bim.Remove('form', id, function(msg){
            alert('刪除成功');
            item.parentNode.removeChild(item)
            redips.remove_from_json(id)
            table.innerHTML = ''
            ID.value = ''
            date.value = ''
            //刪除bind list
            $('#bind-list li').remove();
            $('#form-list option #' + id).remove();
        },function(err){
            alert('伺服器錯誤');
        })         
    }
}

redips.bind_device = function(){
    console.log('open sub window')    
    $('#myModal')[0].style.display = "block";
}