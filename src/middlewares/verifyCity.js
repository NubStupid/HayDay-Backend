const { City } = require("../models");

const verifyCity = async (req, res, next) => {
    const { city } = req.body
    let find = await City.findAll({
        where: {
            city_name: city
        }
    })
    if(find) next()
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
            rekomendasi: all
        })
    }
};

module.exports = verifyCity;
