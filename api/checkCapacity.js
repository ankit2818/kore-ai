const pool = require('../config/db')
const isEmpty = require('../utils/isEmpty')
const {MAX_QUANTITY} = require('../constants')

const checkCapacity = async (req, res) => {
    try {
        const {date} = req.params
        if(isEmpty(date)) {
            return res.status(400).json({success: false, msg: "Provide all parameters."})
        }
        const validDate = new Date(date).toISOString()
        console.log(validDate)
        if(validDate === null || validDate === undefined) {
            return res.status(400).json({success: false, msg: "Invalid date or format."})
        }
        const result = await pool.query(`SELECT sum(quantity) FROM ORDERS WHERE orderdate='${validDate.split('T')[0]}'`)
        let capacity = result.rows[0].sum
        return res.status(200).json({success: true, capacity})
    } catch (error) {
        return res.status(500).json({success: false, msg: error.message})
    }
}

module.exports = checkCapacity