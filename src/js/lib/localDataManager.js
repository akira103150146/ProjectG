function DataManager(){

}

DataManager.prototype.AddData(filename,content) = function(){
    localStorage.setItem(filename,JSON.stringify(content))
}

DataManager.prototype.UpdateData(filename,id,content) = function(){
    let obj = JSON.parse(localStorage.getItem(filename))
    const l = obj.length
    for (let i = 0; i < l; i++) {
        if (obj[i].id == id) {
            obj[i] = content
        }
    }
    localStorage.list_content = JSON.stringify(obj)
}

DataManager.prototype.RemoveData(filename,id) = function(){
    let obj = JSON.parse(localStorage.getItem(filename))
    let index = obj.map(x => x.id.toString()).indexOf(id.toString())

    if (index > -1 && index < obj.length) {
        obj.splice(index, 1)
    }
    else {
        alert('remove item not found!')
    }
}

DataManager.prototype.Filter(filename,attr) = function(){

}