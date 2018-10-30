const router = require('express').Router()
const {User, Transaction, Portfolio} = require('../db/models')
const IEX_API = 'https://api.iextrading.com/1.0'
const axios = require('axios')

module.exports = router

router.get('/transaction/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })
    res.json(transaction)
  } catch (err) {
    next(err)
  }
})

router.post('/transaction/buy', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      const hasEnoughMoney = user.balance >= numOfShares * price
      if(hasEnoughMoney && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
        const newTransaction = await Transaction.create({
          action,
          stockSymbol,
          numOfShares,
          price
        })
        newTransaction.setUser(user)
        const portfolio = await Portfolio.findOne({where: {userId, stockSymbol}})
        if (portfolio) {
          await portfolio.update({numOfShares: portfolio.numOfShares + newTransaction.numOfShares, totalInvested: portfolio.totalInvested + Number(newTransaction.value)})
        } else {
          const newPortfolio = await Portfolio.create({stockSymbol, numOfShares, totalInvested: newTransaction.value})
          newPortfolio.setUser(user)
        }
        await user.update({balance: +user.balance - Number(newTransaction.value)})
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

router.post('/transaction/sell', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      const portfolio = await Portfolio.findOne({where: {userId, stockSymbol}})
      if (portfolio) {
        const hasEnoughShares = portfolio.numOfShares >= numOfShares
        if(hasEnoughShares && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
          const newTransaction = await Transaction.create({
            action,
            stockSymbol,
            numOfShares,
            price
          })
          newTransaction.setUser(user)
          if (portfolio.numOfShares === numOfShares) {
            portfolio.destory();
          } else {
            await portfolio.update({numOfShares: portfolio.numOfShares - newTransaction.numOfShares, totalInvested: portfolio.totalInvested - (portfolio.costBasis * newTransaction.numOfShares)})
          }
          await user.update({balance: +user.balance + Number(newTransaction.value)})
          res.json(newTransaction)
        } else {
          res.status(403).send('Invalid Transaction')
        }
      } else {
        res.status(403).send('User Does Not Own This Stock')
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.status(403).send('Unauthorized User')
  }
})
