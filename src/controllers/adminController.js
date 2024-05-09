const { Users } = require("../models");
const createCrops = (req, res) => {};

const getUsers = async (req, res) => {
    let users = await Users.findAll({
        attributes: ['user_id', 'username', 'display_name', 'email', 'phone_number', 'balance', 'role']
    })
    res.status(200).send(users)
}

const setRole = async (req, res) => {
    const {set} = req.body
    const {user_id} = req.user

    let user = await Users.findOne({
        where : {
            user_id : user_id
        }
    })
    if(!set) return res.status(400).send({message: 'Field set harus diisi!'})
    if(user.status != 'Pending') return res.status(400).send({message: 'Status '+ user.display_name +' tidak pending'})
    
    if(set.toLowerCase() == 'acc'){
        await Users.update(
            {status: 'Approved'},
            {where: {
                user_id : user_id
            }}
        )
        return res.status(200).send({message: 'Permintaan role ' + user.display_name + ' telah disetujui'})
    }
    if(set.toLowerCase() == 'dec'){
        await Users.update(
            {status: 'Declined'},
            {where: {
                user_id : user_id
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
