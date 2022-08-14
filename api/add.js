const pool = require('../config/db')
const isEmpty = require('../utils/isEmpty')
const {MAX_QUANTITY} = require('../constants')

const addOrder = async (req, res) => {
    try {
        const {quantity, customerId} = req.body
        if(isEmpty(quantity) || isEmpty(customerId)) {
            return res.status(400).json({success: false, msg: "Provide all parameters."})
        }
        if(isNaN(quantity) || isNaN(customerId)) {
            return res.status(400).json({success: false, msg: "Invalid parameters value"})
        }

        const custResult = await pool.query(`SELECT count(*) FROM CUSTOMERS WHERE customerid = ${customerId}`)
        if(custResult.rowCount != 1) {
            return res.status(404).json({success: false, msg: "No customer found with provided customer id."})
        }
        const orderResult = await pool.query(`select sum(quantity) from orders where orderdate = '${new Date().toISOString().split('T')[0]}'`)
        let totalQuantity = orderResult.rows[0].sum
        if(isEmpty(totalQuantity)) {
            totalQuantity = 0
        }
        if(!isEmpty(totalQuantity) && !isNaN(totalQuantity) && (parseInt(totalQuantity) + parseInt(quantity)) > MAX_QUANTITY) {
            return res.status(200).json({success: false, msg: `Limit allowed for order is ${MAX_QUANTITY - parseInt(totalQuantity)} Ltrs.`})
        }
        if(!isEmpty(totalQuantity) && !isNaN(totalQuantity) && (parseInt(totalQuantity) + parseInt(quantity)) <= MAX_QUANTITY) {
            const result = await pool.query(`insert into orders (quantity, orderDate, customerId) values ($1, $2, $3) returning *`, [quantity, new Date().toISOString(), customerId])
            return res.status(201).json({success: true, result: result.rows})
        }
        res.status(500).json({success: false, msg: 'Something went wrong'})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
    }
}

module.exports = addOrder