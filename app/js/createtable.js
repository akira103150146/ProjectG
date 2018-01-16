
var test =' "employees": ['+
    '{ "MemberName":"John", "MemberNum":"abc123","ID":"abc","Date":"1987/07/09","Permission":"3" },'+
    '{ "MemberName":"Steve", "MemberNum":"abc456","ID":"www","Date":"1987/07/19","Permission":"2" },'+
   '{ "MemberName":"John", "MemberNum":"abc789","ID":"xyz","Date":"1987/08/09","Permission":"1" } ] }';


function ShowTable (tablename){

    var table = document.getElementById(tablename);    
    var obj = JSON.parse(test);    
    var l = obj.length;
    var attr = ["MemberName", "MemberNum", "ID", "Date", "Permission"];

    for(var i=0;i<l;i++){

        var tr = document.createElement("tr");
        var td_arr = [];
        for(var i=0;i<6;i++)td_arr.push(document.createElement("td"));

        td_arr[0].appendChild(obj[i].MemberName);
        td_arr[1].appendChild(obj[i].MemberNum);
        td_arr[2].appendChild(obj[i].ID);
        td_arr[3].appendChild(obj[i].Date);
        td_arr[4].appendChild(obj[i].Permission);
        td_arr[5].appendChild('<button>編輯</button><button>刪除</button>');
        for(var j=0;j<6;j++)
        tr.appendChild(td_arr[j]);
        table.append(tr);
    }
}


    