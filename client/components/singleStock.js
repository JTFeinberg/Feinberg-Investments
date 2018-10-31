import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchStockThunk, resetStockThunk} from '../store'

/**
 * COMPONENT
 */
class SingleStock extends Component {
  componentDidMount() {
    const {match, loadStockData} = this.props
    loadStockData(match.params.stockSymbol)
  }

  componentWillUnmount() {
    this.props.resetStockState()
  }

  render() {
    const {stock, match, loadStockData} = this.props
    const {quote, logo} = stock
    //If stock symbol doesn't exist, let user know
    return !stock.error ? (
      //If stock does exist but old data is still on state, show Loading...
      //Otherwise show requested stock data
      stock.quote.symbol === match.params.stockSymbol.toUpperCase() ? (
        <div className="single-stock-container">
          <div className="stock-header">
            <h1>{`${quote.companyName} (${quote.symbol})`}</h1>
            <div className="stock-header-sector">
              <span>Sector:</span>
              <span id="sector">{quote.sector}</span>
            </div>
          </div>
          <div className="single-stock-row">
          <ul className="stock-left">
            <li>
              <p>${quote.latestPrice.toFixed(2)}</p>
            </li>
            <li className={quote.change > 0 ? 'gain' : 'loss'}>
              <p>
                ${quote.change.toFixed(2)} ({(
                  quote.change / quote.previousClose
                ).toFixed(2)}%)
              </p>
              <a onClick={() => loadStockData(quote.symbol)}>
                  <div className="refresh-btn" />
                </a>
            </li>
            <li>
              <p>As of {quote.latestTime}</p>
            </li>
          </ul>
          <ul className="stock-right">
            <li>
              <p>
                <span>Previous Close</span>
                <span>${quote.previousClose}</span>
              </p>
            </li>
            <li>
              <p>
                <span>Open</span>
                <span>${quote.open}</span>
              </p>
            </li>
            <li>
              <p>
                <span>Bid x Size</span>
                <span>${quote.iexBidPrice} x {quote.iexBidSize}</span>
              </p>
            </li>
            <li>
              <p>
                <span>Ask x Size</span>
                <span>${quote.iexAskPrice} x {quote.iexAskSize}</span>
              </p>
            </li>
          </ul>
          </div>
        </div>
      ) : (
        <div className="single-stock-container">LOADING...</div>
      )
    ) : (
      <div className="single-stock-container">
        <h1>Invalid Stock Symbol</h1>
        <h1>Please Try Again</h1>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    stock: state.stock
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadStockData(stockSymbol) {
      dispatch(fetchStockThunk(stockSymbol))
    },
    resetStockState() {
      dispatch(resetStockThunk())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleStock)
