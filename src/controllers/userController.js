const { Users, City } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTimeID = require("../utils/functions/getTimeID");
require("dotenv").config();
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;
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
            role: '-',
            status: '-'
        });
        res.status(201).send({
            user_id: id,
            username: username,
            email: email,
            phone_number: phone_number,
        });
    } else {
        res.status(400).send({ message: "Username sudah terdaftar" });
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
        message: "Anda login sebagai " + user.display_name,
        token: access_token,
    });
};

const topup = async (req, res) => {
    const {username, balance} = req.user
    const { topup } = req.body
    if(topup > 0){
        let updatedBalance = parseInt(balance) + parseInt(topup)
    
        await Users.update(
            {balance: updatedBalance}, 
            {where : {
                username: username
            }}
        )
    
        res.status(200).send({
            message: 'Berhasil topup saldo!',
            saldo: updatedBalance
        })
    }
    else{
        res.status(400).send({message: 'Topup harus diatas 0'})
    }
}

const role = async (req, res) => {
    const {user_id} = req.user
    const {role} = req.body

    let user = await Users.findOne({
        where : {
            user_id : user_id
        }
    })

    if(!role) return res.status(400).send({message: 'Role harus diisi!'})
    if(role == 'Farmer' || role == 'Chef' || role == 'Seller'){
        await Users.update(
            {role: role, status: 'Pending'},
            {where: {
                user_id : user_id
            }}
        )
    
        res.status(200).send({message: 'Permintaan untuk menjadi ' + role + ' telah diajukan. Harap menunggu'})
    }
    else if(role == 'Distributor'){
        const {city} = req.body
        if(!city) return res.status(400).send({message: 'Jika anda mendaftar sebagai distributor maka sertakan nama kota'})
        let find = await City.findAll({
            where: {
                city_name: city
            }
        })
        if(find.length != 0) {
            let city = find[0]
            await Users.update(
                {city_id: city.city_id, role: role, status: 'Pending'},
                {where: {
                    user_id : user_id
                }}
            )

            return res.status(200).send({message: 'Permintaan untuk menjadi ' + role + ' telah diajukan. Harap menunggu'})
        }
        else {
            let all = await City.findAll({
                where: {
                    city_name: {
                        [Op.like]: `%${city}%`
                    }
                }
            });
            res.status(404).send({
                message: 'Kota tidak ditemukan',
                rekomendasi: all.length > 0 ? all : '-'
            })
        }
    }
    else{
        res.status(400).send({message: 'Role hanya bisa diisi dengan Distributor/Farmer/Chef/Seller'})
    }
}

const upgrade = async (req, res) => {
    const {user_id} = req.user

    let user = await Users.findOne({
        where : {
            user_id : user_id
        }
    })

    if(user.balance >= 200000){
        if(user.type.toLowerCase() == 'premium') return res.status(400).send({message: 'Akun anda sudah premium!'})
        let saldo = parseInt(user.balance) - 200000
        let update = await Users.update({
            type: 'Premium', balance: saldo
        },
        {
            where : {
                username: user.username
            }
        }
        )
        res.status(200).send({
            message: 'Selamat akun anda menjadi premium',
            sisa_saldo: saldo
        })
    }
    else{
        res.status(400).send({message: 'Saldo anda tidak cukup! Silahkan lakukan topup dahulu'})
    }
}

module.exports = {
    register,
    login,
    topup,
    role,
    upgrade
};
