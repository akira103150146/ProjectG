"use strict";
function SdlManager(){
    this.trash_bin = []      //用來儲存要刪除的事件
    this.AssignForms = []    //用來儲存要指派的任務
}
///////////////////////////////////////////////////////顯示行程/////////////////////////////////////////////////
SdlManager.prototype.ShowSdl = function(){
    let list = sessionStorage.getItem('Sdl-list') == null ? [] : JSON.parse(sessionStorage.getItem('Sdl-list'));
    let staff_list = JSON.parse(sessionStorage.getItem('staff-assign'));
    let staffname = $('#staff-list :selected').text()
    let staffid = staff_list.filter(x => x.name == staffname)[0].id
    console.log(staffid)
    bim_app_window.bim.ShowList('assign', function(msg){
        console.log(msg['content'])
        sessionStorage.list_notify = JSON.stringify(msg['content'])
    },function(err){
        console.log(err)
        if(err.status == 404){
            sessionStorage.list_notify = []
        }
    }, staffid)
    const info = list.filter(x => x.staffId == staffid)
    this.ClearAllEvent()
    for(let i= 0;i<info.length;i++){
        
        let startdate = moment(new Date(info[i].startTime).toISOString())
        let enddate = info[i].startTime == info[i].endTime ? moment(new Date(info[i].endTime + 15 * 60 * 60 * 1000).toISOString()) : moment(new Date(info[i].endTime).toISOString())
       
        if (startdate.isValid() && enddate.isValid()) {
            let event = {
                id: info[i].id,
                title: '任務' + i.toString(),
                start: startdate,
                end: enddate
            }
            $('#calendar').fullCalendar('renderEvent', event, true);
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
    let list = JSON.parse(sessionStorage.getItem('staff-assign')).filter(x => x.identity != 0) 
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
    let staffid = $('#staff-list :selected')[0].id
    let obj
    if(staffid == null){
        alert('沒有選擇到員工')
        return;
    }
    let notify_list
    if(notify_list)
        notify_list = JSON.parse(sessionStorage.list_notify)
    else
        notify_list = []
    console.log(list)
    list.forEach((e)=>{
        let start 
        let end
        console.log(e)
        if(e.start)
            start = e.start._d
        if(e.end)
            end = e.end._d 
        else
            end = new Date(e.start._d).setHours(24) 
      
        if (!Number.isInteger(e.id)){ // do add
            console.log('add')
            obj = {
                'staffId': staffid, 
                'startTime': start,
                'endTime': end ,
                'repeatUnit': 0, 
                'repeatInterval': 0
            }

            let result = this.AssignForms.filter(x => x.scheduleId == e.id)[0]


            bim_app_window.bim.Add('sdl', obj, function (msg) {
                console.log('Assign!')
                if(result){
                    result.scheduleId = msg['content'].id       //派送表單必須綁定行程
                    bim_app_window.bim.Add('assign', result, function(msg){
                        alert('新增成功')
                        console.log(msg['content'])
                    })
                }
                else{
                    console.log('sdl not exist!')
                }
            })
           
        }
        else{// do update
          console.log("update sdl")
            obj = {
                'staffId': staffid,
                'startTime': start,
                'endTime': end,
                'repeatUnit': 0,
                'repeatInterval': 0
            }
          bim_app_window.bim.Update('sdl', e.id, obj, function(msg){
                console.log(msg['content'])
                let update_notification = notify_list.filter(x=> x.scheduleId == e.id)  //去找已經派遣出去的表單
                console.log("update_notification")
                console.log(update_notification)
              
                update_notification.forEach((notification)=>{
                    let fomrtofill = JSON.parse(sessionStorage.list_form).filter(x => x.id == notification.formTemplateId)[0]
                    let requestbody = {
                        'bindedDeviceId': notification.bindedDeviceId,
                        'formTemplateId': notification.formTemplateId,
                        'notificationOffset': notification.notificationOffset,
                        'scheduleId': notification.scheduleId,
                        'title': fomrtofill.title,
                        'content': fomrtofill.content
                    }
                    bim_app_window.bim.Update('assign', notification.id, requestbody, function(msg){
                        console.log(msg['content'])
                    })
                })
               
          })
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
        bim_app_window.bim.Remove('sdl', e)
    })
    this.trash_bin = []
}
///////////////////////////////////////////////////////assign form/////////////////////////////////////////////////
SdlManager.prototype.ShowDevice = function(){
    let list = JSON.parse(sessionStorage.list_device)
    list.forEach((e)=>{
        let op = document.createElement('option')
        op.textContent = e.name
        op.id = e.id
        $('#select-device')[0].appendChild(op)
    })
}
SdlManager.prototype.ShowForm = function(){
    let list = JSON.parse(sessionStorage.list_form)
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
}

SdlManager.prototype.GetTempSdl = function(){
    return this.AssignForms
}