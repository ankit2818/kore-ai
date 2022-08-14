const pool = require('../config/db')
const isEmpty = require('../utils/isEmpty')
const {MAX_QUANTITY} = require('../constants')

const updateOrder = async (req, res) => {
    try {
        const {quantity} = req.body
        const {orderId} = req.params
        if(isEmpty(quantity) || isEmpty(orderId)) {
            return res.status(400).json({success: false, msg: "Provide all parameters."})
        }
        if(isNaN(quantity) || isNaN(orderId)) {
            return res.status(400).json({success: false, msg: "Invalid parameters value"})
        }

        const orderResult = await pool.query(`SELECT * FROM ORDERS WHERE orderId = ${orderId}`)
        if(orderResult.rowCount != 1) {
            return res.status(404).json({success: false, msg: "No order found with provided order id."})
        }
        const orderQuantity = await pool.query(`select sum(quantity) from orders where orderdate = '${new Date().toISOString().split('T')[0]}'`)
        let totalQuantity = orderQuantity.rows[0].sum
        if(isEmpty(totalQuantity)) {
            totalQuantity = 0
        }
        if(!isEmpty(totalQuantity) && !isNaN(totalQuantity) && (parseInt(totalQuantity) + parseInt(quantity) - parseInt(orderResult.rows[0].quantity)) > MAX_QUANTITY) {
            return res.status(200).json({success: false, msg: `Limit allowed for order is ${MAX_QUANTITY - parseInt(totalQuantity) + parseInt(orderResult.rows[0].quantity)} Ltrs.`})
        }
        if(!isEmpty(totalQuantity) && !isNaN(totalQuantity) && (parseInt(totalQuantity) + parseInt(quantity) - parseInt(orderResult.rows[0].quantity)) <= MAX_QUANTITY) {
            const result = await pool.query(`update orders set quantity = ${quantity}, updatedate = '${new Date().toISOString().split('T')[0]}' where orderId = ${orderId} returning *`)
            return res.status(200).json({success: true, result: result})
        }
        res.status(500).json({success: false, msg: 'Something went wrong'})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
    }
}

module.exports = updateOrder