
### Get started:

- Change directory: `cd book-directory`
- Install required modules for server: `npm install`
- Run Server: `npm run dev`
  Server should be started on `http://localhost:5000`


##### Routes:
| Path  | Method | Description | Params |
| ------------- | ------------- | ------------- | ------------- | 
| <code>/getOrder/:page</code>  | GET  | Get all the orders | None |
| <code>/getCustomer/:page</code>  | GET  | Get all customers | None |
| <code>/add</code>  | POST  | Add new order | quantity:int, customerId:int |
| <code>/update/:orderId</code>  | PUT  | Update order details | quantity:int, orderId:int |
| <code>/updateStatus/:orderId</code>  | PUT  | Update order status | status:string, orderId:int |
| <code>/delete/:orderId</code>  | DELETE  | Delete an order | OrderId:int |
| <code>/checkCapacity/:date</code>  | GET  | Check capacity for a particular day | date:yyyy-mm-dd |