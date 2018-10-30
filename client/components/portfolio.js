import React from 'react'
import {connect} from 'react-redux'
import {IEX_API} from '../'
import axios from 'axios'

/**
 * COMPONENT
 */
const Portfolio = ({stocks}) => {

    const stockInfo = async (stockSymbol) => {
        let currInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbol}&types=quote`)
        console.log(currInfo.data[stockSymbol].quote.latestPrice)
        return currInfo.data[stockSymbol].quote
    }
    
  return stocks && stocks.length ? (
    <div className="transactions-container">
      <h3>Transaction History</h3>
      <ul className="transactions-header">
        <li>Stock Symbol</li>
        <li>latest Price</li>
        <li>Number of Shares</li>
        <li>Price Per Share</li>
        <li>Toal Value</li>
        <li>Date of Purchase</li>
      </ul>
      {stocks.map((currStock, idx) => {
        return (
          <ul className={`transactions-row ${idx % 2 === 0 ? 'shade-alternate': '' }`} key={currStock.id} >
            <li>{currStock.stockSymbol}</li>
            <li>{`$${stockInfo(currStock.stockSymbol).latestPrice}`}</li>
            <li>{`${currStock.numOfShares} shares`}</li>
            <li>{`$${Number(currStock.costBasis).toFixed(2)}/share`}</li>
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
