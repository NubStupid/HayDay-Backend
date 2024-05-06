function formatedDate() {
    const date = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
}

function AuditLog (req, res, next) {
    console.log(`[${formatedDate()}] - [${req.method}] ${req.originalUrl}`);
    next();
}

module.exports = {
    AuditLog
};