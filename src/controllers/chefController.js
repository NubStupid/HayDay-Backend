const create = (req, res) => {
    return res.status(200).json({ message: "Create FnB" });
};

const update = (req, res) => {
    return res.status(200).json({ message: "Update FnB" });
};

const del = (req, res) => {
    return res.status(200).json({ message: "Delete FnB" });
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
