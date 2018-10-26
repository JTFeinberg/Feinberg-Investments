const router = require('express').Router()
const {User, Transaction} = require('../db/models')
module.exports = router

router.post('/transaction', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  //if (req.user.id === userId) {
    try {
      const newTransaction = await Transaction.create({
        action,
        stockSymbol,
        numOfShares,
        price
      })
      const user = await User.findById(userId)
      newTransaction.setUser(user)
      console.log(newTransaction)
      res.json(newTransaction)
    } catch (err) {
      next(err)
    }
  // } else {
  //   res.status(403).send('Unauthorized User')
  // }
})
