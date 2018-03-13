function table_manager(){
    this.ipcrender = require('electron').ipcRenderer
    this.current_index = 0
}
table_manager.prototype.showtable = function(data,which){
    let l = data.length
    this.current_index = l

    for(let i =0;i<l;i++){
        let content
        if(which === 'member'){
            content = [data[i].name, data[i].number, data[i].identity, data[i].password, data[i].emailAddress, new Date(data[i].createDate).toDateString(), data[i].id]
            this.append_cell(content, i,'member',false)
        }
        else if(which === 'device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName, data[i].id]
            this.append_cell(content, i ,'device',false)
        }
        else if(which ==='post'){
            content = [data[i].publisherId,data[i].content , data[i].id]
            this.append_cell(content, i, 'post',false)
        }
        else if(which === 'bind_device'){
            content = [data[i].name, data[i].description, data[i].position, data[i].tagName, data[i].id]
            this.append_cell(content, i, 'bind_device',false)
        }
        
    }
}
table_manager.prototype.append_cell = function(content,tr_index,add_type,isnew){
    console.log('append cell')
    let l = content.length
    let tr = document.createElement('tr')
    if(content.length<=0)alert('table content null')
   
    for(let i=0;i<l;i++){
        let td = document.createElement('TD')
        if(content[i] === '內容空白'&& isnew)//if add new add tag to td
            td.setAttribute('id', 'new') 

        if(l === 7 && i === 2){//member.html need set id to options
            let slc = document.createElement('select')
            let texts = ['管理員', '工程師', '檢修人員']
            let dfselected
            if(content[2] === '內容空白')
                dfselected = 0
            else 
                dfselected =new Number(content[2])           
            
            for (let j = 0; j < texts.length; j++) {
                let op = document.createElement('option')
                op.value = j
                op.textContent = texts[j]
                if(j == dfselected)
                    op.setAttribute('selected','selected')
                slc.appendChild(op)
            }
            td.appendChild(slc)
            td.setAttribute('className','staffID')
        }
        else{
            td.setAttribute('contentEditable', true)
            td.textContent = content[i]
        }     
        tr.appendChild(td)
    }
    tr.lastChild.setAttribute('contentEditable', false)
    tr.setAttribute('id', tr_index + 1)//add id

    
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
   
    if(add_type === 'device' || add_type === 'member' ||add_type === 'post'){
        td_2.appendChild(btn)
        td_2.appendChild(btn2)
        if (add_type === 'device') {
            td_2.appendChild(btn3)
        }       
    }
    else if(add_type === 'member'){

    }
    else if(add_type === 'bind_device'){
        td_2.appendChild(btn4)
    }
    tr.appendChild(td_2)
    $('#target')[0].appendChild(tr) 
}
table_manager.prototype.add_cell = function(btn_name,max,type){
    const tempthis = this
    $(btn_name).click(function () {       
        tempthis.current_index++ // add id and set it
        let content = []
        for(let i =0;i<max;i++)
            content.push('內容空白')
        
        tempthis.append_cell(content,tempthis.current_index,type,true)       
    });
}
table_manager.prototype.delete_cell = function(table_name,which){
    const tempipc = this.ipcrender
    $(table_name).on('click', 'button#delete', function () {
        let temp = $(this)[0].parentNode.parentNode // tr
        temp.parentNode.removeChild(temp)       // table 
        let id = $(this)[0].parentNode.previousSibling.textContent
        const flag = ((id === '內容空白') ? true : false)
        if (!flag)//flag = true do request 
            tempipc.send('remove', which,id)
    })
}
table_manager.prototype.save = function(table_name,max){
    const tempipc = this.ipcrender
    $(table_name).on('click', 'button#save', function () {
        let count = max
        let obj 
        let where
        let arr = new Array(max)
       
        $(this)[0].parentNode.parentNode.childNodes.forEach((item) => {
            if (count-- > 0) {  
                if(max === 6 &&  count === 3 ){
                    item.childNodes.forEach((e)=>{
                        if(e.nodeName === 'SELECT'){
                            arr[count] = e.options[e.selectedIndex].value                           
                        }
                    })
                }
                else             
                    arr[count]=item.textContent               
            }
            //remove new tag
            item.setAttribute('id', '')
        })
        //console.log(arr)
        if(max === 6){
            where = 'member'
            obj = {
                'name': arr[5],
                'password': arr[2],
                'number': arr[4],
                'identity': arr[3],
                'emailAddress': arr[1]
            }           
        }
        else if(max === 4){
            where = 'device'
            obj = {
                'name': arr[3],
                'Description': arr[2],
                'position': arr[1],
                'tagName': arr[0]
            }            
        }
        else if(max === 3){
            where = 'post'
            obj = {
                'publisherId': 8,
                'content': arr[1]
            }
        }  
       
        let id = $(this)[0].parentNode.previousSibling.textContent // get previous td 
        const flag = ((id === '內容空白') ? true : false)
        const tag = $(this)[0].parentNode.parentNode.id
        //console.log('tag is ')
        //console.log(tag)
        //true =>add false=>update
        if(flag)    
            tempipc.send('add', where, obj,tag)
        else
            tempipc.send('update', where,id,obj,tag)       
    })  
} 
table_manager.prototype.update_cell = function(which,content,tag){
    let tr = document.getElementById(tag)
    if(tr == null)alert('tr is null!')
    //console.log('update -- ')
    //console.log(tag)
   
    let arr = []

    if(which === 'member'){
        arr.push(content.name)
        arr.push(content.number)
        arr.push(content.identity)
        arr.push(content.password)   
        arr.push(content.emailAddress)
        arr.push(new Date(content.createDate).toDateString())
        arr.push(content.id)
    }
    else if(which === 'device'){
        arr.push(content.name)
        arr.push(content.description)
        arr.push(content.position)
        arr.push(content.tagName)
        arr.push(content.id)
        
    }
    else if (which === 'post'){
        arr.push(content.publisherId)
        arr.push(content.content)
        arr.push(content.id)
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