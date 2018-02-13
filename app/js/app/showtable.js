function table_manager(){
    this.ipcrender = require('electron').ipcRenderer
}
table_manager.prototype.setIpc = function(ipc){
    this.ipcrender = ipc
    //console.log(this.ipcrender)
}
table_manager.prototype.showtable = function(data,which){
    let l = data.length 
    //console.log(data)
    for(let i =0;i<l;i++){
        let tr = document.createElement('TR')
        let count = 0
        let max
        let content
        if(which === 'member'){
            max = 7
            content = [data[i].name,data[i].number,data[i].identity,data[i].password,data[i].emailAddress,new Date(data[i].createDate).toDateString(),data[i].id]
        }
        else if(which === 'device'){
            max = 5
            content = [data[i].name,data[i].description,data[i].position,data[i].tagName,data[i].id]
        }
        while (count<max) {
            let td = document.createElement('TD')
            td.setAttribute('contentEditable', true)
            td.textContent = content[count]
            tr.appendChild(td)
            count++
        }
        tr.lastChild.setAttribute('contentEditable', false)
        if(which ==='member')
        tr.lastChild.previousSibling.setAttribute('contentEditable', false)
        let td_2 = document.createElement('TD')
        let btn = document.createElement('BUTTON')
        let btn2 = document.createElement('BUTTON')
        btn.textContent = '刪除'
        btn.id = 'delete'
        btn2.textContent = '儲存'
        btn2.id = 'save'
        td_2.appendChild(btn)
        td_2.appendChild(btn2)
        tr.appendChild(td_2)
        $('#target')[0].appendChild(tr)  
    }
}
table_manager.prototype.add_cell = function(table_name,btn_name,max){
    $(btn_name).click(function () {
        let tr = document.createElement('TR');
        let count = max;
        while (count-- > 0) {
            let td = document.createElement('TD');
            td.setAttribute('contentEditable', true);
            td.setAttribute('id', 'new')
            td.textContent = 'undefined';
            tr.appendChild(td);
        }
        tr.lastChild.setAttribute('contentEditable', false)
        if (max === 7)
            tr.lastChild.previousSibling.setAttribute('contentEditable', false)
        let td_2 = document.createElement('TD')
        let btn = document.createElement('BUTTON')
        let btn2 = document.createElement('BUTTON')
        td_2.setAttribute('id', 'new')
        btn.textContent = '刪除'
        btn.id = 'delete'
        btn2.textContent = '儲存'
        btn2.id = 'save'
        td_2.appendChild(btn)
        td_2.appendChild(btn2)
        tr.appendChild(td_2)
        $(table_name)[0].appendChild(tr);
    });
}
table_manager.prototype.delete_cell = function(table_name,which){
    const tempipc = this.ipcrender
    $(table_name).on('click', 'button#delete', function () {
        let temp = $(this)[0].parentNode.parentNode
        temp.parentNode.removeChild(temp)
        let id = $(this)[0].parentNode.previousSibling.textContent
        const flag = ((id === 'undefined') ? true : false)
        if(!flag)//flag = true do request 
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
                //console.log(item.textContent)
                //console.log(count)
                arr[count]=item.textContent
            }
            //remove new tag
            item.setAttribute('id', '')
        })
        //console.log(arr)
        if(max === 6){
            where = 'member'
            obj = {
                'name': '',
                'password': '',
                'number': '',
                'identity': '',
                'emailAddress': ''
            }
            obj.emailAddress = arr[1]
            obj.password = arr[2]
            obj.identity = arr[3]
            obj.number = arr[4]
            obj.name = arr[5]
        }
        else if(max === 4){
            where = 'device'
            obj = {
                'name': '',
                'Description': '',
                'position': '',
                'tagName': ''
            }
            obj.name = arr[3]
            obj.Description = arr[2]
            obj.position = arr[1]
            obj.tagName = arr[0]
        }
        //console.log(obj)

        let id = $(this)[0].parentNode.previousSibling.textContent
        const flag = ((id === 'undefined') ? true : false)
       // console.log(flag)

        if(flag)//true =>add false=>update
        tempipc.send('add', where, obj)
        else
        tempipc.send('update', where,id,obj)
       
    })  
} 