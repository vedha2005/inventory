const dashboardModel = require("../models/dashboardModel");


// =====================================================
// Dashboard Counts
// =====================================================
const getDashboardCounts = (req, res) => {

    const branchId = req.query.branch_id;
    const role = req.query.role;

    const isSuperAdmin = role === "SUPER_ADMIN";


    // Branch user must have branch ID
    if (!isSuperAdmin && !branchId) {

        return res.status(400).json({
            success: false,
            message: "Branch ID is required"
        });

    }


    dashboardModel.getDashboardCounts(
        branchId,
        isSuperAdmin,
        (err, result) => {

            if (err) {

                console.log(
                    "DASHBOARD COUNT ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            res.status(200).json({

                success: true,

                totalProducts:
                    result[0].totalProducts,

                totalCustomers:
                    result[0].totalCustomers

            });

        }
    );

};



// =====================================================
// Low Stock Products
// =====================================================
const getLowStockProducts = (req, res) => {

    const branchId = req.query.branch_id;
    const role = req.query.role;

    const isSuperAdmin = role === "SUPER_ADMIN";


    // Branch user must have branch ID
    if (!isSuperAdmin && !branchId) {

        return res.status(400).json({
            success: false,
            message: "Branch ID is required"
        });

    }


    dashboardModel.getLowStockProducts(
        branchId,
        isSuperAdmin,
        (err, result) => {

            if (err) {

                console.log(
                    "LOW STOCK ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });

            }


            res.status(200).json({

                success: true,

                products: result

            });

        }
    );

};



// =====================================================
// Export Controllers
// =====================================================
module.exports = {
    getDashboardCounts,
    getLowStockProducts
};