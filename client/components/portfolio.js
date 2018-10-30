import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPortfolioThunk} from '../store'

/**
 * COMPONENT
 */
class Portfolio extends Component {
    componentDidMount() {
        let stockSymbolsStr 
        if(this.props.stocks) {
            stockSymbolsStr = this.props.stocks.map(currStock => currStock.stockSymbol).join(',')
            this.props.loadStockQuotes(stockSymbolsStr)
        }
    }
 
  render() {
      const {stocks, latestStockData} = this.props
      return stocks && stocks.length  && latestStockData[stocks[0].stockSymbol] ? (
        <div className="transactions-container">
          <h3>Transaction History</h3>
          <ul className="transactions-header">
            <li>Stock Symbol</li>
            <li>Latest Price</li>
            <li>Today's Gain/Loss</li>
            <li>Total Gain/Loss</li>
            <li>Current Value</li>
            <li>Quantity</li>
            <li>Cost Basis</li>
            <li>Total Invested</li>
            <li>Date of Purchase</li>
          </ul>
          {stocks.map((currStock, idx) => {
              let {latestPrice, open} = latestStockData[currStock.stockSymbol].quote
              let currValue = (currStock.numOfShares * latestPrice).toFixed(2)
              let totalChange = (currValue - Number(currStock.totalInvested)).toFixed(2)
              let todaysChange = (latestPrice - open).toFixed(2)
            return (
              <ul className={`transactions-row ${idx % 2 === 0 ? 'shade-alternate': '' }`} key={currStock.id} >
                <li>{currStock.stockSymbol}</li>
                <li>{`$${latestPrice}`}</li>
                <li>{`${todaysChange}\n${(todaysChange / open * 100).toFixed(2)}%`}</li>
                <li>{`${totalChange}\n${(totalChange / Number(currStock.totalInvested) * 100).toFixed(2)}%`}</li>
                <li>{`$${currValue}`}</li>
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
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    stocks: state.user.portfolios,
    latestStockData: state.portfolio
  }
}

const mapDispatchToProps = disptach => {
    return {
      loadStockQuotes: (ownedStockSymbols) => disptach(fetchPortfolioThunk(ownedStockSymbols))
    }
  }



export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)
