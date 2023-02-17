

const getHomePage = async (req, res) => {
    console.log("11111111111111111111", req.file, req.body);
    res.status(200).send("hello World!!");
};


module.exports = {
    getHomePage
};