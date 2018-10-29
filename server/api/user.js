const router = require('express').Router()
const {User, Transaction} = require('../db/models')
const IEX_API = 'https://api.iextrading.com/1.0'
const axios = require('axios')

module.exports = router

//router.get('/portfolio'), async ()

router.post('/transaction', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      if(user.balance >= numOfShares * price && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
        const newTransaction = await Transaction.create({
          action,
          stockSymbol,
          numOfShares,
          price
        })
        newTransaction.setUser(user)
        res.json(newTransaction)
      } else {
        res.status(403).send('Invalid Transaction')
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.status(403).send('Unauthorized User')
  }
})
