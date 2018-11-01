import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPortfolioThunk, me} from '../store'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
class Portfolio extends Component {
    async componentDidMount() {
        let stockSymbolsStr 
        let {stocks, loadStockQuotes,fetchUserData} = this.props
        if(this.props.stocks) {
            await fetchUserData()
            stockSymbolsStr = stocks.map(currStock => currStock.stockSymbol).join(',')
            loadStockQuotes(stockSymbolsStr)
        }
    }
 
  render() {
      const {user, stocks, latestStockData} = this.props
      return stocks && stocks.length  && latestStockData[stocks[0].stockSymbol] ? (
        <div className="portfolio-container">
          <h3>{user.fullName}'s Portfolio</h3>
          <ul className="portfolio-header">
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
              let todaysChangeColor = todaysChange > 0 ? 'gain' : todaysChange < 0 ? 'loss' : 'no-change'
              let totalChangeColor = totalChange > 0 ? 'gain' : totalChange < 0 ? 'loss' : 'no-change'
            return (
              <Link to={`stock_info/${currStock.stockSymbol}`} key={currStock.id}>
                <ul className={`portfolio-row ${idx % 2 === 0 ? 'shade-alternate': '' }`} >
                  <li>{currStock.stockSymbol}</li>
                  <li className={todaysChangeColor}>${latestPrice.toFixed(2)}<br/>${todaysChange}</li>
                  <li className={todaysChangeColor}>${(todaysChange * currStock.numOfShares).toFixed(2)}<br/>{(todaysChange / open * 100).toFixed(2)}%</li>
                  <li className={totalChangeColor}>${totalChange}<br/>{(totalChange / Number(currStock.totalInvested) * 100).toFixed(2)}%</li>
                  <li>{`$${currValue}`}</li>
                  <li>{`${currStock.numOfShares} shares`}</li>
                  <li>{`$${Number(currStock.costBasis).toFixed(2)}/share`}</li>
                  <li>{`$${Number(currStock.totalInvested).toFixed(2)}`}</li>
                  <li>{`${currStock.createdAt.split('T')[0]}`}</li>
                </ul>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="no-data-container">
          <h3>You have no transaction histrory</h3>
          <Link to="/user/trade_form"><h3>Click here to begin trading!</h3></Link>
        </div>
      )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    user: state.user,
    stocks: state.user.portfolios,
    latestStockData: state.portfolio
  }
}

const mapDispatchToProps = dispatch => {
    return {
      loadStockQuotes: (ownedStockSymbols) => dispatch(fetchPortfolioThunk(ownedStockSymbols)),
      fetchUserData: () => dispatch(me())
    }
  }



export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)
