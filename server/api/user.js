const router = require('express').Router()
const {User, Transaction, Portfolio} = require('../db/models')
const IEX_API = 'https://api.iextrading.com/1.0'
const axios = require('axios')

module.exports = router
//This route is used for trade confimations on the front end
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
 //We use this route when a user is buying stock
router.post('/transaction/buy', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      const hasEnoughMoney = user.balance >= numOfShares * price
      //Similar to validations we do on the front end but we don't need tech savvy users abusing the system.
      //Does the user have enough money? does the stock exist? is the user only buying whole numbers worth of shares?
      if(hasEnoughMoney && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
        const newTransaction = await Transaction.create({
          action,
          stockSymbol,
          numOfShares,
          price
        })
        newTransaction.setUser(user)
        const portfolio = await Portfolio.findOne({where: {userId, stockSymbol}})
        //Does the user already own this stock? If so, then we update the info in the portfolio. Otherwise, we create a new instance.
        if (portfolio) {
          await portfolio.update({numOfShares: portfolio.numOfShares + newTransaction.numOfShares, totalInvested: portfolio.totalInvested + Number(newTransaction.value)})
        } else {
          const newPortfolio = await Portfolio.create({stockSymbol, numOfShares, totalInvested: newTransaction.value})
          newPortfolio.setUser(user)
        }
        //update the users balance to reflect that a purchase has been made
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

//Similar to the buy route, but since different checks/updates had to be made for sales, we use this route instead
//will look to combine routes in future
router.post('/transaction/sell', async (req, res, next) => {
  const {action, stockSymbol, numOfShares, price, userId} = req.body
  if (req.user.id === userId) {
    try {
      const user = await User.findById(userId)
      const stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
      const portfolio = await Portfolio.findOne({where: {userId, stockSymbol}})
      if (portfolio) {
        const hasEnoughShares = portfolio.numOfShares >= numOfShares
        //Main difference from the above is instead of checking if the user has enough money to buy stock, 
        //we look to see if the user has enough shares to sell!
        if(hasEnoughShares && stockInfo.data[stockSymbol] && !numOfShares.includes('.')){
          const newTransaction = await Transaction.create({
            action,
            stockSymbol,
            numOfShares,
            price
          })
          newTransaction.setUser(user)
          //Is the user selling all of their shares? If so, delete the instance form the portfolio model.
          //Otherwise, update the instance with the new data
          if (portfolio.numOfShares === +numOfShares) {
            portfolio.destroy()
          } else {
            await portfolio.update({numOfShares: portfolio.numOfShares - newTransaction.numOfShares, totalInvested: portfolio.totalInvested - (portfolio.costBasis * newTransaction.numOfShares)})
          }
          //update the users balance to reflect that a sale has been made
          await user.update({balance: (+user.balance + Number(newTransaction.value)).toFixed(2)})
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
