const pool = require('../config/db')

const getCustomers = async (req, res) => {
    const {page} = req.params || 0
    const result = await pool.query(`SELECT * FROM CUSTOMERS LIMIT 10 OFFSET ${page * 10}`)
    res.status(200).json(result.rows)
}

module.exports = getCustomers