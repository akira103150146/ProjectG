"use strict";
function SdlManager(){
    this.trash_bin = []
}
///////////////////////////////////////////////////////顯示行程/////////////////////////////////////////////////
SdlManager.prototype.ShowSdl = function(){
    let list = JSON.parse(localStorage.getItem('Sdl-list'))
    let staff_list = JSON.parse(localStorage.getItem('staff-assign'))
    let staffname = $('#staff-list :selected').text()
    let staffid = staff_list.filter(x => x.name == staffname)[0].id
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
    list.forEach((e)=>{
        let op = document.createElement('option')
        op.textContent = e.name
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
        //console.log(e)
        let start 
        let end
        if(e.start)
            start = e.start._i
        if(e.end)
            end = e.end._i
         
        if (!Number.isInteger(e.id)){ // do add
            console.log('add')
            obj = {
                'staffId': staffid, 
                'startTime': start == undefined ? null : start, 
                'endTime': end == undefined ? null : end,
                'repeatUnit': 0, 
                'repeatInterval': 0
            }
            console.log(obj)
           ipcrender.send('add', 'sdl', obj)
        }
        else{// do update
            console.log('update')
            obj = {
                'staffId': staffid,
                'startTime': start == undefined ? null : start,
                'endTime': end == undefined ? null : end,
                'repeatUnit': 0,
                'repeatInterval': 0
            }
            console.log(obj)
           ipcrender.send('update', 'sdl', e.id,obj)
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
        ipcrender.send('remove','sdl',e)
    })
    this.trash_bin = []
}

