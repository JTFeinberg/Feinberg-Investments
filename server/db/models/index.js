const User = require('./user')
const Transaction = require('./transaction')
const Portfolio = require('./portfolio')
/**
 * All model associations
 */
Transaction.belongsTo(User)
User.hasMany(Transaction)

Portfolio.belongsTo(User)
User.hasMany(Portfolio)
/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 */
module.exports = {
  User,
  Transaction,
  Portfolio
}
