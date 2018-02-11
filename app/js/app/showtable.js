function showtable(data,which){
    let l = data.length 
    for(let i =0;i<l;i++){
        let tr = document.createElement('TR')
        let count = 0
        let max
        let content
        if(which === 'member'){
            max = 6
            content = [data[i].name,data[i].number,data[i].identity,data[i].password,data[i].emailAddress,new Date(data[i].createDate).toDateString()]
        }
        else if(which === 'device'){
            max = 4
            content = [data[i].name,data[i].description,data[i].postion,data[i].tagName]
        }
        while (count<max) {
            let td = document.createElement('TD')
            td.setAttribute('contentEditable', true)
            td.textContent = content[count]
            tr.appendChild(td)
            count++
        }
        let td = document.createElement('TD')
        let btn = document.createElement('BUTTON')
        let btn2 = document.createElement('BUTTON')
        btn.textContent = '刪除'
        btn.id = 'delete'
        btn2.textContent = '儲存'
        btn2.id = 'save'
        td.appendChild(btn)
        td.appendChild(btn2)
        tr.appendChild(td)
        $('#target')[0].appendChild(tr)  
    }
}
function add_cell(table_name,btn_name,max){
    $(btn_name).click(function () {
        var tr = document.createElement('TR');
        var count = max;
        while (count-- > 0) {
            var td = document.createElement('TD');
            td.setAttribute('contentEditable', true);
            td.setAttribute('id', 'new')
            td.textContent = 'undefined';
            tr.appendChild(td);
        }
        var td = document.createElement('TD')
        var btn = document.createElement('BUTTON')
        var btn2 = document.createElement('BUTTON')
        td.setAttribute('id', 'new')
        btn.textContent = '刪除'
        btn.id = 'delete'
        btn2.textContent = '儲存'
        btn2.id = 'save'
        td.appendChild(btn)
        td.appendChild(btn2)
        tr.appendChild(td)
        $(table_name)[0].appendChild(tr);
    });
}
function delete_cell(table_name){
    $(table_name).on('click', 'button#delete', function () {
        var temp = $(this)[0].parentNode.parentNode
        temp.parentNode.removeChild(temp)
    })
}
function save(table_name,max){
    $(table_name).on('click', 'button#save', function () {
        // ipcrender.send('add-member', 'test')
        let count = max
        $(this)[0].parentNode.parentNode.childNodes.forEach((item) => {
            if (count-- > 0) {
                //console.log(item.textContent)
            }
            item.setAttribute('id', '')
        })
    })   
}