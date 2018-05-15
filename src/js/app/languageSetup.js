"use strict";

var obj = JSON.parse(localStorage.Language);
const lan_which = obj.Language;
const content = obj.LanguageOption[lan_which];

function SetUpLoginLanguage()
{
    $('#login_head')[0].textContent = content.login_head;
    $('#login_btn')[0].textContent = content.login_btn;
}

function SetUpPostLanguage()
{
   
    $('#add-btn')[0].textContent    = content.addpost;
    $('#pb_staff')[0].textContent = content.pb_staff;
    $('#post_title')[0].textContent = content.post_title;
    $('#post_content')[0].textContent = content.post_content;
    $('#post_date')[0].textContent = content.post_date;
  
}

function SetUpFormLanguage()
{
  
    $('#mergecell')[0].value = content.mergecell;
    $('#hsplitcell')[0].value = content.hsplitcell;
    $('#vsplitcell')[0].value = content.vsplitcell;
    $('#addcolumn')[0].value = content.addcolumn;
    $('#deletecolumn')[0].value = content.deletecolumn;
    $('#addrow')[0].value = content.addrow;
    $('#deleterow')[0].value = content.deleterow;
    $('#addtable')[0].value = content.addtable;
    $('#savetable')[0].value = content.savetable;
    $('#deletetable')[0].value = content.deletetable;
    $('#bindtable')[0].value = content.bindtable;
    $('#device_id')[0].textContent = content.device_id;
    $('#device_des')[0].textContent = content.device_des;
    $('#device_pos')[0].textContent = content.device_pos;
    $('#device_spot')[0].textContent = content.device_spot;
    $('#confirm')[0].textContent = content.confirm;
    $('#p_title')[0].textContent = content.p_title;
    $('#p_createDate')[0].textContent = content.p_createDate;
    $('#p_binddevice')[0].textContent = content.p_binddevice;
    $('#h_binddevice')[0].textContent = content.h_binddevice;
}

function SetUpDeviceLanguage()
{
    $('#device_id')[0].textContent = content.device_id;
    $('#device_des')[0].textContent = content.device_des;
    $('#device_pos')[0].textContent = content.device_pos;
    $('#device_spot')[0].textContent = content.device_spot;
    $('#t_cpnname')[0].textContent = content.t_cpnname;
    $('#t_cpnid')[0].textContent = content.t_cpnid;
    $('#t_cpnnum')[0].textContent = content.t_cpnnum;
}

function SetUpCpnLanguage()
{
    $('#add-classfication')[0].textContent = content.addtype;
    $('#remove-classfication')[0].textContent = content.deletetype;
    $('#update-classfication')[0].textContent = content.updatetype;
    $('#add-btn')[0].textContent = content.addCpn;
    $('#t_cpnname')[0].textContent = content.t_cpnname;
    $('#t_cpnid')[0].textContent = content.t_cpnid;
    $('#t_cpnnum')[0].textContent = content.t_cpnnum;
}

function SetUpHistoryLanguage()
{
    $('#p_reportdate')[0].textContent = content.p_reportdate;
    $('#p_title')[0].textContent = content.p_title;
}

function SetUpMemberLanguage()
{
    $('#search-btn')[0].textContent = content['search-btn'];
    $('#back-btn')[0].textContent = content['back-btn'];
    $('#add-btn')[0].textContent = content['add-btn'];
    $('#p_staffname')[0].textContent = content.membername;
    $('#p_staffid')[0].textContent = content.membernumber;
    $('#t_id')[0].textContent = content.identity;
    $('#t_pw')[0].textContent = content.password;
    $('#p_email')[0].textContent = content.email;
    $('#t_date')[0].textContent = content.createDate;
    
}