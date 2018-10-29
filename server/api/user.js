const router = require('express').Router()
const {User, Transaction, Portfolio} = require('../db/models')
const IEX_API = 'https://api.iextrading.com/1.0'
const axios = require('axios')

module.exports = router

router.post('/transaction/buy', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      const inPortfolio = await Portfolio.findOne({where: {userId, stockSymbol}})
      const hasEnough = action === 'BUY' ? user.balance >= numOfShares * price : inPortfolio.numOfShares <= numOfShares
      if(hasEnough && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
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
