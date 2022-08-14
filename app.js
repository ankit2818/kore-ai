const express = require('express')

/**Import environment variables */
const PORT = process.env.PORT || 5000

/**Initialize app */
const app = express()
app.use(express.json())

/**Import api */
const addOrder = require('./api/add')
const updateOrder = require('./api/update')
const updateStatus = require('./api/updateStatus')
const deleteOrder = require('./api/delete')
const checkCapacity = require('./api/checkCapacity')
const getOrder = require('./api/getOrders')

app.get('/getOrder/:page', getOrder)
app.post('/add', addOrder)
app.post('/update/:orderId', updateOrder)
app.post('/updateStatus/:orderId', updateStatus)
app.delete('/delete/:orderId', deleteOrder)
app.get('/checkCapacity/:date', checkCapacity)

/**Start server */
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}.`)
})