const pool = require('../config/db')
const isEmpty = require('../utils/isEmpty')

const updateStatus = async (req, res) => {
    try {
        const {status} = req.body
        const {orderId} = req.params
        if(isEmpty(status) || isEmpty(orderId)) {
            return res.status(400).json({success: false, msg: "Provide all parameters."})
        }
        if(isNaN(orderId)) {
            return res.status(400).json({success: false, msg: "Invalid parameters value"})
        }

        const orderResult = await pool.query(`SELECT * FROM ORDERS WHERE orderId = ${orderId}`)
        if(orderResult.rowCount != 1) {
            return res.status(404).json({success: false, msg: "No order found with provided order id."})
        }
        if(!(status === "placed" || status === "packed" || status === "dispatched" || status === "delivered")) {
            return res.status(400).json({success: false, msg: "Invalid status value."})
        }
        const orderStatus = orderResult.rows[0].status
        if(orderStatus === status || orderStatus === "delivered" || (orderStatus === "dispatched" && status === "placed") || (orderStatus === "dispatched" && status === "packed") || (orderStatus === "packed" && status === "placed")) {
            return res.status(400).json({success: false, msg: `Cannot change order status to ${status} as order status is already ${orderStatus}`})
        }
        const result = await pool.query(`UPDATE ORDERS SET status = '${status}' WHERE orderId = ${orderId} returning *`)
        res.status(200).json({success: true, result: result.rows})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
    }
}

module.exports = updateStatus