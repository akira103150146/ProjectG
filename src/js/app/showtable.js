"use strict";

function table_manager(){
    this.ipcrender = require('electron').ipcRenderer
    this.current_index = 0
    this.dict = {
        "post": 3,
        "member": 6,
        "device": 4,
        "info": 3
    }
}
///////////////////////////////////////////////////////顯示表格/////////////////////////////////////////////////
table_manager.prototype.showtable = function(data,which){
    this.ClearTable()
    let l = data.length
    this.current_index = l
   
    for(let i =0;i<l;i++){
        let content
        if(which === 'member'){
            content = [data[i].name, data[i].number, data[i].identity, data[i].password, data[i].emailAddress, new Date(data[i].createDate).toDateString()]
            this.append_cell(content, data[i].id, 'member', false)
        }
        else if(which === 'device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName]
            this.append_cell(content, data[i].id, 'device', false)
        }
        else if(which ==='post'){
            content = [data[i].publisherId, data[i].content, new Date(data[i].createTime).toDateString()]
            this.append_cell(content, data[i].id, 'post', false)
        }
        else if(which === 'bind_device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName]
            this.append_cell(content, data[i].id, 'bind_device', false)
        }
        else if(which === 'Cpn'){
            content = [data[i].name, data[i].number, data[i].quantity]
            this.append_cell(content, data[i].id, 'Cpn', false)
        }
        
    }
}
table_manager.prototype.ClearTable = function(){
    $('#target')[0].innerHTML = ''
}

///////////////////////////////////////////////////////新增表格/////////////////////////////////////////////////
table_manager.prototype.append_cell = function(content,tr_index,add_type,isnew){

    let l = content.length
    let tr = document.createElement('tr')
    if(content.length<=0)alert('table content null')
   
    for(let i=0;i<l;i++){
        let td = document.createElement('TD')
      
        //if add new add tag to td
        if(isnew)
            td.setAttribute('id', 'new') 

        //member.html need set id to options
        if(add_type === 'member' && i === 2){
            td.className = 'staffID'
            td.appendChild(this.add_slc(content[2]))
        }
        else{
            if (add_type === 'post' && (i == 0 || i == l-1))
                td.contentEditable = false
            else if(add_type === 'member' && i == l-1)
                td.contentEditable = false
            else{
                td.setAttribute('contentEditable', true)
                td.className = "data-field"
            }
            td.textContent = content[i]
        }     
        tr.appendChild(td)
    }
        //將物件id綁在tr上
        tr.setAttribute('id', tr_index)

    
    /**add delete and save button**/
    let td_2 = document.createElement('TD')
    let btn = document.createElement('BUTTON')
    let btn2 = document.createElement('BUTTON')
    let btn3 = document.createElement('BUTTON')
    let btn4 = document.createElement('BUTTON')
    btn.textContent = '刪除'
    btn.id = 'delete'
    btn2.textContent = '儲存'
    btn2.id = 'save'
    btn3.textContent = '產生QRCODE'
    btn3.id = 'get_qrcode'
    btn4.textContent = '將此設備綁定表單'
    btn4.id = 'bind'
   
    if(add_type === 'device' || add_type === 'member' ||add_type === 'post'||add_type === 'info' ||add_type ==='Cpn'){
        td_2.appendChild(btn)
        td_2.appendChild(btn2)
        if (add_type === 'device') {
            td_2.appendChild(btn3)
        }       
    }
    else if(add_type === 'bind_device'){
        td_2.appendChild(btn4)
    }
    tr.appendChild(td_2)
    $('#target')[0].appendChild(tr) 
}
///////////////////////////////////////////////////////顯示選項/////////////////////////////////////////////////
table_manager.prototype.add_slc = function(value){
    let texts = ['管理員', '工程師', '檢修人員']
    let slc = document.createElement('select')
    let dfselected

    if (value === '內容空白')
        dfselected = 0
    else
        dfselected = new Number(value)

    for (let j = 0; j < texts.length; j++) {
        let op = document.createElement('option')
        op.value = j
        op.textContent = texts[j]
        if (j == dfselected)
            op.setAttribute('selected', 'selected')
        slc.appendChild(op)
    }
    return slc
}
///////////////////////////////////////////////////////新增CEll/////////////////////////////////////////////////
table_manager.prototype.add_cell = function(btn_name,type){
    const tempthis = this
    $(btn_name).click(function () {       
        tempthis.current_index++ // add id and set it
        let content = []
        for(let i =0;i<tempthis.dict[type];i++){
            if(i == 0 && type === 'post')
                content.push(localStorage.getItem('user-id'))
            else 
                content.push('內容空白')
        }
        
        tempthis.append_cell(content,tempthis.current_index,type,true)       
    });
}
///////////////////////////////////////////////////////刪除Cell/////////////////////////////////////////////////
table_manager.prototype.delete_cell = function(table_name,which){
    const tempipc = this.ipcrender
    $(table_name).on('click', 'button#delete', function () {
        let temp = $(this)[0].parentNode.parentNode // tr
        temp.parentNode.removeChild(temp)       // table 
        let isnew = $(this)[0].parentNode.previousSibling.id
        let id = $(this)[0].parentNode.parentNode.id
        console.log(id)
        if (isnew!= 'new')//flag = true do request 
            tempipc.send('remove', which,id)
    })
}
///////////////////////////////////////////////////////儲存表格/////////////////////////////////////////////////
table_manager.prototype.save = function(table_name,type){
    const tempthis = this
    $(table_name).on('click', 'button#save', function () {
        let max = tempthis.dict[type]
        let count = max
        let obj 
        let where
        let arr = new Array(max)
        let id = $(this)[0].parentNode.previousSibling.id// get previous td 
        const tag = $(this)[0].parentNode.parentNode.id
        console.log(tag)
        let i = 0
        $('#' + tag).find('td').each(function(index,e){
            console.log(e.className)
                if(e.className == 'data-field')
                    arr[i] = e.textContent
                else if (e.className == 'staffID')
                    arr[i] = $(e).find('select')[0].selectedIndex                

                i++
        })
       
       
        if(type === 'member'){           
            obj = {
                'name': arr[0],
                'number': arr[1],
                'identity': arr[2],
                'password': arr[3],
                'emailAddress': arr[4]
            }           
        }
        else if(type === 'device'){           
            obj = {
                'name': arr[0],
                'Description': arr[1],
                'position': arr[2],
                'tagName': arr[3]
            }            
        }
        else if(type === 'post'){           
            obj = {
                'publisherId': localStorage.getItem('user-id'),
                'content': arr[1]
            }
        }
        else if(type === 'info'){
            obj = {
               'name': arr[0],
               'number' : arr[1],
               'quantity' : arr[2],
               'componentTypeId': 2,
               'bindedDeviceId' : 8
            }
        }       
        console.log(obj)
        //true =>add false=>update
        if(id == 'new'){    
            console.log('add')
            tempthis.ipcrender.send('add', type, obj, tag)
        }else{
            console.log('update')
            tempthis.ipcrender.send('update', type, tag, obj, tag)
        }       
    })  
} 
///////////////////////////////////////////////////////更新CEll/////////////////////////////////////////////////
table_manager.prototype.update_cell = function(which,content,tag){
    let tr = document.getElementById(tag)
    console.log(tr)
    if(tr == null)
        alert('tr is null!')
    
    let arr = []
    console.log(content)
    if(which === 'member'){
        arr.push(content.name)
        arr.push(content.number)
        arr.push(content.identity)
        arr.push(content.password)   
        arr.push(content.emailAddress)
        arr.push(new Date(content.createDate).toDateString())        
    }
    else if(which === 'device'){
        arr.push(content.name)
        arr.push(content.description)
        arr.push(content.position)
        arr.push(content.tagName)      
    }
    else if (which === 'post'){
        arr.push(content.publisherId)
        arr.push(content.content)
        arr.push(new Date(content.createTime).toDateString())      
    }
   
    let count = 0
    tr.childNodes.forEach((item)=>{    
        if (item.nodeName == 'TD' && count < arr.length && item.childNodes[0].nodeName != 'SELECT'){
            item.textContent = arr[count]  
        }     
        count++  
    })
}
table_manager.prototype.remove_index = function(id){
    const index  = this.table_indexes.findIndex(id)
}