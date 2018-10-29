import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
const Portfolio = ({stocks}) => {
  return stocks && stocks.length ? (
    <div className="transactions-container">
      <h3>Transaction History</h3>
      <ul className="transactions-header">
        <li>Stock Symbol</li>
        <li>Number of Shares</li>
        <li>Price Per Share</li>
        <li>Toal Value</li>
        <li>Date of Purchase</li>
      </ul>
      {stocks.map((currStock, idx) => {
        return (
          <ul className={`transactions-row ${idx % 2 === 0 ? 'shade-alternate': '' }`} key={currStock.id} >
            <li>{currStock.stockSymbol}</li>
            <li>{`${currStock.numOfShares} shares`}</li>
            <li>{`$${Number(currStock.coastBasis).toFixed(2)}/share`}</li>
            <li>{`$${Number(currStock.totalInvested).toFixed(2)}`}</li>
            <li>{`${currStock.createdAt.split('T')[0]}`}</li>
          </ul>
        )
      })}
    </div>
  ) : (
    <div>
      <h3>You have no transaction histrory</h3>
      <h3>Click here to begin trading!</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    stocks: state.user.portfolios
  }
}

export default connect(mapState)(Portfolio)
