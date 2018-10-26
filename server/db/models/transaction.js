const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  action: {
    type: Sequelize.ENUM('BUY', 'SELL'),
    allowNull: false
  },
  stockSymbol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {len: [1,5]}
  },
  numOfShares: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  value: {
    type: Sequelize.VIRTUAL,
    get() {
      return () => this.getDataValue('numOfShares') * this.getDataValue('price')
    }
  }
})

module.exports = Transaction