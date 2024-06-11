const create = (req, res) => {
    return res.status(200).json({ message: "Create FnB" });
};

const update = (req, res) => {
    return res.status(200).json({ message: "Update FnB" });
};

const deleteFnB = async (req, res) => {
    try {
        const farm = req.barn;
        await FnB.destroy({
            where: {
                fnb_id: farm.farm_id,
            },
        });
        return res.status(200).json({
            STATUS_CODE: "SUCCESFULLY DELETED A " + req.type,
            username: req.user.username,
            farm_deleted: farm.farm_id,
        });
    } catch (error) {
        return res.status(400).json({
            ERR_CODE: "ERROR DELETING BARN",
            message: error.toString(),
            path: "deleteFnB (controller)",
        });
    }
};

const get = (req, res) => {
    return res.status(200).json({ message: "Get FnB" });
};

module.exports = {
    create,
    update,
    del,
    get,
};
