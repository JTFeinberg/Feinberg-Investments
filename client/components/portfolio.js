import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPortfolioThunk, me} from '../store'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
class Portfolio extends Component {
  constructor(props){
    super(props)
    this.state = {
      sortOn: '',
      order: 0
    }
  }
    async componentDidMount() {
      let stockSymbolsStr 
      let {stocks, loadStockQuotes,fetchUserData} = this.props
      if(stocks.length) {
        //fetchUserData is for updating the users portfolio to reflect recent transactions 
       await fetchUserData()
       //stockSymbolsStr is passed in to loadStockQuotes to be used for a batch load of quotes from the IEX API
       //That endpoint uses a comma delimited string of symbols, hence the .join(',')
        stockSymbolsStr = this.props.stocks.map(currStock => currStock.stockSymbol).join(',')
        await loadStockQuotes(stockSymbolsStr)
      }
    }
    handleSort = async (sortVal) => {
      let {sortOn, order} = this.state
      if (sortVal !== sortOn) {
        await this.setState({sortOn: sortVal, order: 1})
      } else {
        order++
        await this.setState({order})
        // if (order === 'ascending') this.setState({order: 'descending'})
        // if (order === 'descending') this.setState({order: ''})
        // if (order === '') this.setState({order: 'ascending'})
      }
    }
    compare = (a, b) => {
      const {sortOn, order} = this.state
      let valueA = a[sortOn] ? a[sortOn] : a.quote[sortOn]
      let valueB = b[sortOn] ? b[sortOn] : b.quote[sortOn]
      let sortOrder = order % 3
      if(sortOrder === 1) return valueA - valueB
      if(sortOrder === 2) return valueB - valueA
      if(sortOrder === 0) return 0
    }
 
  render() {
      const {user, stocks, latestStockData} = this.props
      if(latestStockData[stocks[0].stockSymbol]) {
        stocks.forEach(currStock => {
        currStock.quote = this.props.latestStockData[currStock.stockSymbol].quote
      })
    }
       console.log(stocks)
      //If the user has no stocks/has just signed up, show the alternate div encouraging them to begin trading!
      return stocks && stocks.length  && latestStockData[stocks[0].stockSymbol] ? (
        <div className="portfolio-container">
          <h3>{user.fullName}'s Portfolio</h3>
          {/* This list is used as a header row for the portfolio */}
          <ul className="portfolio-header">
            <li onClick={() => this.handleSort("stockSymbol")}>Stock Symbol</li>
            <li onClick={() => this.handleSort("latestPrice")}>Latest Price</li>
            <li onClick={() => this.handleSort("todaysChange")}>Today's Gain/Loss</li>
            <li onClick={() => this.handleSort("totalChange")}>Total Gain/Loss</li>
            <li onClick={() => this.handleSort("currValue")}>Current Value</li>
            <li onClick={() => this.handleSort("numOfShares")}>Quantity</li>
            <li onClick={() => this.handleSort("costBasis")}>Cost Basis</li>
            <li onClick={() => this.handleSort("totalInvested")}>Total Invested</li>
            <li onClick={() => this.handleSort("createdAt")}>Date of Purchase</li>
          </ul>
          {/* This is the meat of the portfolio. Here we loop over the stocks from the state,
           and check its most recent data that was loaded onto the state in the componentDidMount. */}
          {stocks.map((currStock, idx) => {
              /*
              These come from the IEX API. They are the price of the stock at the open of the market from the day,
              and the most recent price
              */
              let {latestPrice, open} = currStock.quote
              //The current value of the users stock based on how many shares they own and the latest price
              let currValue = (currStock.numOfShares * latestPrice).toFixed(2)
              //How much has the stock changed in value since the user bought the stock
              let totalChange = (currValue - Number(currStock.totalInvested)).toFixed(2)
              //How much has the stock changed since the open
              let todaysChange = (latestPrice - open).toFixed(2)
              /*
              ** These will be used for classNames to dynamically render color.
              ** If the change is positive, variable = 'gain',
              ** If negative variable = 'loss', 
              ** Otherwise it equals 'no-change'
              */
              let todaysChangeColor = todaysChange > 0 ? 'gain' : todaysChange < 0 ? 'loss' : 'no-change'
              let totalChangeColor = totalChange > 0 ? 'gain' : totalChange < 0 ? 'loss' : 'no-change'
            return (
              <Link to={`stock_info/${currStock.stockSymbol}`} key={currStock.id}>
                <ul className={`portfolio-row ${idx % 2 === 0 ? 'shade-alternate': '' }`} >
                  <li name='stockSymbol' value={currStock.stockSymbol} >{currStock.stockSymbol}</li>
                  <li className={todaysChangeColor}>${latestPrice.toFixed(2)}<br/>${todaysChange}</li>
                  {/* 
                  Change in value for this stock in the users portfolio for the day, and the percent change
                  Percent change is (B - A)/A * 100
                   */}
                  <li className={todaysChangeColor}>${(todaysChange * currStock.numOfShares).toFixed(2)}<br/>{(todaysChange / open * 100).toFixed(2)}%</li>
                  {/* 
                  Change in value for this stock in the users portfolio since the stock was purchased, and the percent change
                  Percent change is (B - A)/A * 100
                   */}
                  <li className={totalChangeColor}>${totalChange}<br/>{(totalChange / Number(currStock.totalInvested) * 100).toFixed(2)}%</li>
                  <li>{`$${currValue}`}</li>
                  <li>{`${currStock.numOfShares} shares`}</li>
                  {/* Cost basis is calculated as the users total invesment/# of shares owned */}
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
