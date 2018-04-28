"use strict";

function table_manager(){
    this.ipcrender = require('electron').ipcRenderer
    this.current_index = 0
    this.dict = {   //網頁有幾個儲存格
        "post": 4,
        "member": 6,
        "device": 4,
        "info": 3
    }
}
///////////////////////////////////////////////////////顯示表格/////////////////////////////////////////////////
table_manager.prototype.showtable = function(data, which){

    this.ClearTable()

    let l = data.length
    this.current_index = l
    let dist_bind_device = []

    for(let i =0;i<l;i++){
        let content
        if(which === 'member'){
            content = [data[i].name, data[i].number, data[i].identity, data[i].password, data[i].emailAddress, new Date(data[i].createDate).toISOString()]
            this.append_cell(content, data[i].id, 'member', false)
        }
        else if(which === 'device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName]
            this.append_cell(content, data[i].id, 'device', false)
        }
        else if(which ==='post'){
            content = [data[i].publisherId,data[i].title, data[i].content, new Date(data[i].createTime).toISOString()]
            this.append_cell(content, data[i].id, 'post', false)
        }
        else if(which === 'bind_device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName]
            this.append_cell(content, data[i].id, 'bind_device', false)
            dist_bind_device[parseInt(data[i].id)] = data[i].name
        }
        else if(which === 'bind_Cpn'){
            content = [data[i].name, data[i].number, data[i].quantity, data[i].componentTypeId]
            this.append_cell(content, data[i].id, 'bind_Cpn', false)
        }
        else if(which === 'Cpn'){
            content = [data[i].name, data[i].number, data[i].quantity, data[i].componentTypeId]
            this.append_cell(content, data[i].id, 'Cpn', false)
        }

    }
    if (which === 'bind_device')
        localStorage.dist_device = JSON.stringify(dist_bind_device)
}
table_manager.prototype.ShowByFilter = function(which){

    this.ClearTable()

    if(which === 'info'){
        let list = JSON.parse(localStorage.list_info)
        let id = $('#selection :selected')[0].id
        const info = list.filter(x => x.componentTypeId == id || x.componentTypeId == null)
        console.log(info)
        info.forEach((data)=>{
            let content = [data.name, data.number, data.quantity]
            this.append_cell(content, data.id, 'info', false)
        })
    }
    else if(which === 'member'){
        let list = JSON.parse(localStorage.member_list)
        let name = $('#member-name')[0].value
        let num = $('#member-number')[0].value
        let email = $('#member-email')[0].value
        if(name != '')
            list = list.filter(x => x.name == name)
        if(num != '')
            list = list.filter(x => x.number == num)
        if(email != '')
            list = list.filter(x => x.emailAddress == email)
        console.log(list)
        list.forEach((data)=>{
            let content = [data.name, data.number, data.identity, data.password, data.emailAddress, new Date(data.createDate).toDateString()]
            this.append_cell(content, data.id, 'member', false)
        })
    }
    else if(which === 'device'){
        let list = JSON.parse(localStorage.list_device)
        let num = $('#device-num')[0].value
        let pos = $('#device-pos')[0].value
        
        if (num != '')
            list = list.filter(x => x.name == num)
        if (pos != '')
            list = list.filter(x => x.position == pos)
        console.log(list)
        list.forEach((data) => {
            let content = [data.name, data.description, data.position, data.tagName]
            this.append_cell(content, data.id, 'device', false)
        })
    }

}

table_manager.prototype.ClearTable = function(){
    console.log('clean table')
    $('#target tr').slice(1).remove()
}

///////////////////////////////////////////////////////新增表格/////////////////////////////////////////////////
table_manager.prototype.append_cell = function (content,tr_index,add_type,isnew){
    let l = content.length
    let tr = document.createElement('tr')
    let list = JSON.parse(localStorage.member_list)
    if(content.length<=0)alert('table content null')
   
    for(let i=0;i<l;i++){
        let td = document.createElement('TD')
      
        //if add new add tag to td
        if(isnew)
            td.setAttribute('id', 'new') 
        else if(add_type === 'Cpn' || add_type === 'info'){
            let list = JSON.parse(localStorage.list_info)
            list = list.filter(x => x.id == tr_index)
            if(list[0].componentTypeId == null)
                td.setAttribute('id', 'notype')
        }
        //member.html need set id to options
        if(add_type === 'member' && i === 2){
            td.className = 'staffID'
            td.appendChild(this.add_slc(content[2]))
        }
        else if (add_type === 'device' && i === 4){

        }
        else{
            if (add_type === 'post' && (i == 0 || i == l-1))
                td.contentEditable = false
            else if(add_type === 'member' && i == l-1)
                td.contentEditable = false
            else{
                td.setAttribute('contentEditable', true)
                td.className = "data-field"             //要設定成data field 在抓取資料時才會抓這個格子
                if (add_type === 'post' && i == 1) {
                    td.style.maxWidth = '500px'
                    td.style.height = 'auto'
                    td.contentEditable = true
                }
            }
            if(add_type === 'post' && i == 0 )
                td.textContent = list.filter(x => x.id == content[0])[0].name
            else
                td.textContent = content[i]
        }     
        if (!((add_type === 'Cpn' || add_type === 'bind_Cpn') && i == l-1))
            tr.appendChild(td)
    }
        //將物件id綁在tr上
        if(isnew)
            tr.setAttribute('id', 'loc_' + tr_index)
        else
            tr.setAttribute('id', tr_index)
    
    /**add delete and save button**/
    let td_2 = document.createElement('TD')
    let btn = document.createElement('BUTTON')
    let btn2 = document.createElement('BUTTON')
    btn.textContent = '刪除'
    btn.id = 'delete'
    btn2.textContent = '儲存'
    btn2.id = 'save'
    
    if(add_type === 'device' || add_type === 'member' ||add_type === 'post'||add_type === 'info' ||add_type ==='Cpn'){
        td_2.appendChild(btn)
        td_2.appendChild(btn2)
        if (add_type === 'device') {
            let btn3 = document.createElement('BUTTON')
            btn3.textContent = '產生QRCODE'
            btn3.id = 'get_qrcode'
            td_2.appendChild(btn3)
            let btn7 = document.createElement('BUTTON')
            btn7.textContent = '綁定零件'
            btn7.className = 'binded-Cpn'
            td_2.appendChild(btn7)
        } 
        else if(add_type === 'info' || add_type === 'Cpn'){
            // let btn5 = document.createElement('BUTTON')
            // btn5.textContent = '設定分類'
            // btn5.id = 'set-class'
            // td_2.appendChild(btn5)
        }      
    }
    else if(add_type === 'bind_device' || add_type === 'bind_Cpn'){
        let btn4 = document.createElement('BUTTON')
        btn4.textContent = '將此設備綁定'
        btn4.id = 'bind'
        let btn6 = document.createElement('BUTTON')
        btn6.textContent = '解除綁定'
        btn6.className = 'Unbind'
        td_2.appendChild(btn4)
        td_2.appendChild(btn6)
    }
    tr.appendChild(td_2)
    if (add_type != 'bind_Cpn')
       $('#target')[0].appendChild(tr) 
    else
       $('#target2')[0].appendChild(tr) 

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
        let arr = []
        let id = $(this)[0].parentNode.previousSibling.id// get previous td 
        const tag = $(this)[0].parentNode.parentNode.id
        console.log(tag)
    
        $('#target ' + '#' + tag).find('td').each(function(index,e){
           // console.log(e.className)
                if(id == 'new')
                    e.id = ''
                if(e.className == 'data-field')
                {
                    console.log('add to obj')
                    arr.push(e.textContent)
                } 
                else if (e.className == 'staffID')
                {
                    console.log('add to obj')
                    arr.push($(e).find('select')[0].selectedIndex)  
                }                                   
        })
        console.log(arr)
       
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
            let result = JSON.parse(localStorage.list_device).filter(x => x.id == tag)[0]
            
            obj = {
                'name': arr[0],
                'description': arr[1],
                'position': arr[2],
                'tagName': arr[3],
                'componentIds': result == null ? [] : result.componentIds.map(Number)
            }           
            
        }
        else if(type === 'post'){           
            obj = {
                'publisherId': localStorage.getItem('user-id'),
                'title': arr[0],
                'content': arr[1]
            }
        }
        else if(type === 'info'){
            let result = JSON.parse(localStorage.list_info).filter(x => x.id == tag)[0]
            console.log(result)
            obj = {
               'name': arr[0],
               'number' : arr[1],
               'quantity' : arr[2],
               'componentTypeId': $('#selection :selected')[0].id == null ? alert('沒有選取到類別') : $('#selection :selected')[0].id,
               'bindedDeviceId': result == null ? [] : result.bindedDeviceId
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