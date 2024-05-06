const getUSDFormat = (value)=>{
    const formattedValue = new Intl.NumberFormat("fr-FR",{
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
     }).format(value)
     return formattedValue
}
module.exports = getUSDFormat