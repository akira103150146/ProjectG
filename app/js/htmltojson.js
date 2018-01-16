function Cell(type,colspan,rowspan,editable,content){
    this.type = type;
    this.colspan = colspan;
    this.rowspan = rowspan;
    this.editable = editable;
    this.content = content;
}

function ToJson(rows){      
    var l = rows.length;
    console.log(rows);
    var result = [];

    for (var i = 0; i < l; i++) {
        var cells = rows[i].cells;
        console.log(cells);
        var l2 = cells.length;
        console.log(l2);
        for (var j = 0; j < l2; j++) {         
            var temp = new Cell('text',cells[j].colSpan,cells[j].rowSpan,cells[j].contentEditable,cells[j].innerHTML);
            result.push(temp);
        } 
        result.push('\n');      
    }
    console.log(result);
    var msg = JSON.stringify(result);
    console.log(msg);
    
}