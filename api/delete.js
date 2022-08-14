const pool = require('../config/db')
const isEmpty = require('../utils/isEmpty')

const deleteOrder = async (req, res) => {
    try {
        const {orderId} = req.params
        if(isEmpty(orderId)) {
            return res.status(400).json({success: false, msg: "Provide all parameters."})
        }
        if(isNaN(orderId)) {
            return res.status(400).json({success: false, msg: "Invalid parameters value"})
        }

        const result = await pool.query(`SELECT count(*) FROM ORDERS WHERE orderId = ${orderId}`)
        if(result.rowCount != 1) {
            return res.status(404).json({success: false, msg: "No order found with provided order id."})
        }
        const deleteResult = await pool.query(`DELETE FROM ORDERS WHERE orderId=${orderId}`)
        res.status(200).json({success: true})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
    }
}

module.exports = deleteOrder