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
    const {stock, match} = this.props
    const {quote, logo} = stock
    //If stock symbol doesn't exist, let user know
    return !stock.error ? (
        //If stock does exist but old data is still on state, show Loading...
        //Otherwise show requested stock data
      stock.quote.symbol === match.params.stockSymbol.toUpperCase() ? (
        <div>
          <div className="stock-header">
            <h1>{`(${quote.symbol}) ${quote.companyName}`}</h1>
            <ul className="stock-header-list">
              <li>{quote.sector}</li>
            </ul>
          </div>

          <ul className='stock-left'>
          <li><p>${quote.latestPrice}</p></li>
          <li className={quote.latestPrice > quote.previousClose ? 'gain' : 'loss'}><p>${(quote.latestPrice - quote.previousClose).toFixed(2)} ({((quote.latestPrice - quote.previousClose)/quote.previousClose).toFixed(2)}%)</p></li>
          </ul>
          <ul className='stock-right'>
          <li><p><span>Stock Symbol: </span>{quote.symbol}</p></li>
          <li><p><span>Stock Symbol: </span>{quote.symbol}</p></li>
          </ul>
        </div>
      ) : (
        <div>LOADING...</div>
      )
    ) : (
      <div>
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
