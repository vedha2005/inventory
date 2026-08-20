const dashboardModel = require("../models/dashboardModel");


// Dashboard Counts
const getDashboardCounts = (req, res) => {

    dashboardModel.getDashboardCounts((err, result) => {

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

    });

};


// Low Stock Products
const getLowStockProducts = (req, res) => {

    dashboardModel.getLowStockProducts((err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(200).json({
            success: true,
            products: result
        });

    });

};


module.exports = {
    getDashboardCounts,
    getLowStockProducts
};