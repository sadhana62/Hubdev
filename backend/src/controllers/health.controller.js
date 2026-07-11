const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "DevHub Backend is running"
    });
};

module.exports = {
    getHealth
};