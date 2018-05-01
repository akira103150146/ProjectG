"use strict";
function SdlManager(){
    this.trash_bin = []      //用來儲存要刪除的事件
    this.AssignForms = []    //用來儲存要指派的任務
}
///////////////////////////////////////////////////////顯示行程/////////////////////////////////////////////////
SdlManager.prototype.ShowSdl = function(){
    let list = JSON.parse(localStorage.getItem('Sdl-list'))
    let staff_list = JSON.parse(localStorage.getItem('staff-assign'))
    let staffname = $('#staff-list :selected').text()
    let staffid = staff_list.filter(x => x.name == staffname)[0].id
    //ipcrender.send('ready-to-show', 'notify', staffid)
    const info = list.filter(x => x.staffId == staffid)
    this.ClearAllEvent()
    for(let i= 0;i<info.length;i++){
        let startdate = moment(new Date(info[i].startTime).toISOString())
        let enddate = moment(new Date(info[i].endTime).toISOString())
        if (startdate.isValid() && enddate.isValid()) {
            let event = {
                id: info[i].id,
                title: '任務' + i.toString(),
                start: startdate,
                end: enddate
            }
            $('#calendar').fullCalendar('renderEvent', event,true);
        } else {
            alert('Invalid date.');
            break;
        }
    }
} 

SdlManager.prototype.ClearAllEvent = function(){
    let list = $('#calendar').fullCalendar('clientEvents')
    list.forEach((e)=>{
        $('#calendar').fullCalendar('removeEvents', e.id)
    })
  
}
///////////////////////////////////////////////////////新增人員/////////////////////////////////////////////////
SdlManager.prototype.AddStaff = function(){
    let list = JSON.parse(localStorage.getItem('staff-assign')).filter(x => x.identity != 0) 
    $('#staff-list').append('<option disabled selected value> -- select an option -- </option>')
    list.forEach((e)=>{
        let op = document.createElement('option')
        op.textContent = e.name
        op.id = e.id
        $('#staff-list').append(op)
    })
        
}
///////////////////////////////////////////////////////儲存行程/////////////////////////////////////////////////
SdlManager.prototype.SaveSdl = function(){
    let list = $('#calendar').fullCalendar('clientEvents')
    let staff_list = JSON.parse(localStorage.getItem('staff-assign'))
    let staffname = $('#staff-list :selected').text()
    let staffid = staff_list.filter(x => x.name == staffname)[0].id
    let obj
    list.forEach((e)=>{
        let start 
        let end
        console.log(e)
        if(e.start)
            start = e.start._d
        if(e.end)
            end = e.end._d
        console.log(start)
        console.log(end)
        if (!Number.isInteger(e.id)){ // do add
            console.log('add')
            obj = {
                'staffId': staffid, 
                'startTime': start == undefined ? null : start, 
                'endTime': end == undefined ? start  : end,
                'repeatUnit': 0, 
                'repeatInterval': 0
            }
            console.log(obj)
           //ipcrender.send('add', 'sdl', obj, e.id)   //將local id傳過去 才能判別傳回來的時候到底要抓哪一筆資料去assign form
        }
        else{// do update
            console.log('update')
            //從local 儲存抓出資料來
            let list2 = JSON.parse(localStorage.list_notify)
            list2 = list2.filter(x => x.scheduleId == e.id)[0]
            console.log(start)
            console.log(end)
            obj = {
                'staffId': staffid,
                'startTime': start == undefined ? null : start,
                'endTime': end == undefined ? start : end,
                'repeatUnit': 0,
                'repeatInterval': 0
            }
            let obj2 = {
                'bindedDeviceId': list2.bindedDeviceId,
                'formTemplateId': list2.formTemplateId ,
                'notificationOffset': list2.notificationOffset,
                'scheduleId': e.id
            }
            console.log(obj)
            console.log(obj2)
            //ipcrender.send('update', 'sdl', e.id, obj, list2.id, obj2)
        }
    })
    if(this.trash_bin.length > 0)
        this.DeleteSdl()
}
///////////////////////////////////////////////////////將要刪除的行程儲存/////////////////////////////////////////////////
SdlManager.prototype.ThrowToBin = function(id){
    console.log(id)
    if (Number.isInteger(id))
        this.trash_bin.push(id)
}
///////////////////////////////////////////////////////刪除所有垃圾桶裡面的行程/////////////////////////////////////////////////
SdlManager.prototype.DeleteSdl = function(){
    this.trash_bin.forEach((e)=>{
        //ipcrender.send('remove','sdl',e)
    })
    this.trash_bin = []
}
///////////////////////////////////////////////////////assign form/////////////////////////////////////////////////
SdlManager.prototype.ShowDevice = function(){
    let list = JSON.parse(localStorage.list_device)
    list.forEach((e)=>{
        let op = document.createElement('option')
        op.textContent = e.name
        op.id = e.id
        $('#select-device')[0].appendChild(op)
    })
}
SdlManager.prototype.ShowForm = function(){
    let list = JSON.parse(localStorage.list_form)
    let selected_deviceId = $('#select-device :selected')[0].id
    console.log(selected_deviceId)
    $('#select-form')[0].innerHTML = ''
    list.forEach((e) => {
        console.log(e.deviceIds)
        if (e.deviceIds.indexOf(parseInt(selected_deviceId)) >= 0)
        {
            let op = document.createElement('option')
            op.textContent = e.title
            op.id = e.id
            $('#select-form')[0].appendChild(op)
        }
    })
}

SdlManager.prototype.AddTempSdl = function(info){
    console.log('AddTemp')
    console.log(info)
    this.AssignForms.push(info)
}

SdlManager.prototype.AssignSdl = function(tag, id){
    console.log('Assign!')
    let result = this.AssignForms.filter(x => x.scheduleId == tag)[0]
    console.log(id)
    result.scheduleId = id
    console.log(result)
    //ipcrender.send('add', 'assign', result)
}

SdlManager.prototype.GetTempSdl = function(){
    return this.AssignForms
}