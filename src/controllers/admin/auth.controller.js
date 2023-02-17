
const getHomePage = async (req, res) => {
    // console.log("Inside Home Page Upload", req.body.text, req.files); //Coming From Multer Middleware
    res.status(200).send('Hello World !!');
};


module.exports = {
    getHomePage
};