const dashboardModel = require("../models/dashboardModel");

const getDashboardCounts = (req, res) => {

    dashboardModel.getDashboardCounts(
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }

            res.status(200).json({
                success: true,
                totalProducts: result[0].totalProducts,
                totalCustomers: result[0].totalCustomers
            });

        }
    );

};

module.exports = {
    getDashboardCounts
};