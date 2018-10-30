const Sequelize = require('sequelize')
const db = require('../db')

const Portfolio = db.define('portfolio', {
  stockSymbol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {len: [1,5]}
  },
  numOfShares: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  totalInvested: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  costBasis: {
      type: Sequelize.VIRTUAL,
      get() {
        return `${(this.getDataValue('totalInvested') / this.getDataValue('numOfShares')).toFixed(2)}`
      } 
  }
})

module.exports = Portfolio