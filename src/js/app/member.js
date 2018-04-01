function staff(name,number,id,autherity,password,email,builddate){
   this.name = name;
   this.number = number;
   this.id = id;
   this.autherity = autherity;
   this.password = password;
   this.email = email;
   this.builddate = builddate;
}
function memberoperation(){

}
memberoperation.prototype.search = function(){

}
memberoperation.prototype.save = function(){

}
memberoperation.prototype.showtable = function(j_text){
    var table = document.getElementById('target').innerHTML;
    var l;    
    while(l-->0){
        var tr = document.createElement('TR');                    
        var count = 7;  
        while(count-->0){
            var td = document.createElement('TD');
            td.setAttribute('contentEditable',true);
            td.textContent = 'undefined';
            tr.appendChild(td);
        }
        var td = document.createElement('TD');
        var btn = document.createElement('BUTTON');
        btn.textContent = '刪除';                      
        td.appendChild(btn);
        tr.appendChild(td);  
        table.appendChild(tr);
    }        

}