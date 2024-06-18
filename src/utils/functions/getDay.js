const getDay = (time)=>{
    const date = new Date(time)
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2,"0")
    const day = (date.getDate()).toString().padStart(2,"0")
    time =  day+"-"+month+"-"+year
    // console.log(time);
    return time
}

module.exports = getDay