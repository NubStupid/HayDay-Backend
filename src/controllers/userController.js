const { Users } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTimeID = require("../utils/functions/getTimeID");
const JWT_KEY = "HAYDAY";
const register = async (req, res) => {
    const { username, password, confirm_password, email, phone_number } =
        req.body;
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
        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) return res.status(400).send(err);
            let insert = await Users.create({
                user_id: id,
                username: username,
                password: hash,
                email: email,
                phone_number: phone_number,
                balance: 0,
            });
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

    let find = await Users.findAll({
        where: {
            username: username,
        },
    });

    if (find.length == 0)
        return res.status(404).send({ message: "User tidak ditemukan" });

    let user = find[0];

    try {
        const match = await bcrypt.compare(password, user.password);
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

    let update = await Users.update({
        access_token: access_token,
        where: {
            username: username
        }
    })

    res.status(200).send({
        message: 'Anda login sebagai ' + user.email,
        token: access_token
    })
};

module.exports = {
    register,
    login,
};
