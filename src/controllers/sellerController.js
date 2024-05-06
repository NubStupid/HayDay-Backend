const buy = (req, res) => {
    return res.status(200).json({ message: "Buy Item" });
};

const update = (req, res) => {
    return res.status(200).json({ message: "Update Item" });
};

const del = (req, res) => {
    return res.status(200).json({ message: "Delete Item" });
};

const get = (req, res) => {
    return res.status(200).json({ message: "Get Item" });
};

module.exports = {
    buy,
    update,
    del,
    get,
};
