const { Users } = require("../models");
const createCrops = (req, res) => {};

const getUsers = async (req, res) => {
    let users = await Users.findAll({
        attributes: ['user_id', 'username', 'display_name', 'email', 'phone_number', 'balance', 'role', 'status']
    })
    res.status(200).send(users)
}

const setRole = async (req, res) => {
    const {username, set} = req.body

    let user = await Users.findOne({
        where : {
            username : username
        }
    })
    if(!set || !username) return res.status(400).send({message: 'Semua field harus diisi!'})
    if(user.status != 'Pending') return res.status(400).send({message: 'Status '+ user.display_name +' bukan pending'})
    
    if(set.toLowerCase() == 'acc'){
        await Users.update(
            {status: 'Approved'},
            {where: {
                username : username
            }}
        )
        return res.status(200).send({message: 'Permintaan role ' + user.display_name + ' telah disetujui'})
    }
    if(set.toLowerCase() == 'dec'){
        await Users.update(
            {status: 'Declined'},
            {where: {
                username : username
            }}
        )
        return res.status(200).send({message: 'Permintaan role ' + user.display_name + ' ditolak'})
    }
    else{
        res.status(400).send({message: 'Set hanya bisa diisi dengan Acc (Approve)/Dec (Decline)'})
    }
}

module.exports = {
    createCrops,
    getUsers,
    setRole
};
