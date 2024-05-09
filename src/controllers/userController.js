const { Users } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTimeID = require("../utils/functions/getTimeID");
const JWT_KEY = "HAYDAY";
const register = async (req, res) => {
    const { username, password, confirm_password, display_name, email, phone_number } = req.body;
    const schema = Joi.object({
        username: Joi.string().required().messages({
            "any.required": "Semua field wajib diisi",
        }),
        password: Joi.string().required().messages({
            "any.required": "Semua field wajib diisi",
        }),
        confirm_password: Joi.string().valid(Joi.ref("password")).messages({
            "any.required": "Semua field wajib diisi",
            "any.only": "Confirm password harus sama dengan password",
        }),
        display_name: Joi.string().required().messages({
            "any.required": "Semua field wajib diisi",
        }),
        email: Joi.string().email().required().messages({
            "any.required": "Semua field wajib diisi",
            "string.empty": "Semua field wajib diisi",
            "string.email": "Format email salah",
        }),
        phone_number: Joi.number().integer().messages({
            "any.required": "Semua field wajib diisi",
            "number.base": "Phone number harus angka",
        }),
    });
    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        let errmsg = error.message;
        let err = errmsg.substring(errmsg.indexOf(":") + 1);
        return res.status(400).send({ message: err });
    }
    let findUser = await Users.count({
        where: {
            username: username,
        },
    });
    if (findUser == 0) {
        let time = getTimeID();
        let ctid = await Users.count({
            where: {
                user_id: {
                    [Op.like]: `%${time}%`,
                },
            },
        });
        let id = "USER" + time + (ctid + 1).toString().padStart(4, "0");
        let hashpass = await bcrypt.hash(password, 10);
        let insert = await Users.create({
            user_id: id,
            username: username,
            password: hashpass,
            display_name: display_name,
            email: email,
            phone_number: phone_number,
            balance: 0,
        });
        res.status(201).send({
            user_id: id,
            username: username,
            email: email,
            phone_number: phone_number,
        });
    } else {
        res.status(400).send({ message: "User sudah terdaftar" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const schema = Joi.object({
        username: Joi.string().required().messages({
            "any.required": "Semua field wajib diisi",
        }),
        password: Joi.string().required().messages({
            "any.required": "Semua field wajib diisi",
        }),
    });
    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        let errmsg = error.message;
        let err = errmsg.substring(errmsg.indexOf(":") + 1);
        return res.status(400).send({ message: err });
    }

    let user = await Users.findOne({
        where: {
            username: username,
        },
    });

    if (!user)
        return res.status(404).send({ message: "User tidak ditemukan" });


    try {
        const match = await bcrypt.compare(
            password, 
            user.password
        );
        if (!match) {
            return res.status(400).send({ message: "Password salah" });
        }
    } catch (e) {
        console.log("Error : ", e);
    }

    let access_token = jwt.sign(
        {
            username: username,
        },
        JWT_KEY,
        { expiresIn: "3600s" }
    );

    let update = await Users.update(
        { access_token: access_token },
        { 
            where: { 
                username: username 
            } 
        }
    );

    res.status(200).send({
        message: "Anda login sebagai " + user.email,
        token: access_token,
    });
};

const topup = async (req, res) => {
    const username = req.username
    const { balance } = req.body

    if(balance > 0){
        let user = await Users.findOne({
            where: {
                username: username
            }
        })
    
        let updatedBalance = parseInt(user.balance) + parseInt(balance)
    
        await Users.update(
            {balance: updatedBalance}, 
            {where : {
                username: username
            }}
        )
    
        res.status(200).send({
            message: 'Berhasil topup saldo!',
            saldo_anda: updatedBalance
        })
    }
    else{
        res.status(400).send({message: 'Topup harus diatas 0'})
    }
}

module.exports = {
    register,
    login,
    topup
};
