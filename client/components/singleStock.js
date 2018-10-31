import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchStockThunk} from '../store'

/**
 * COMPONENT
 */
class SingleStock extends Component {
  componentDidMount() {
    const {match, loadStockData} = this.props
    loadStockData(match.params.stockSymbol)
  }
  
  render() {
    const {stock, match} = this.props
    //If stock symbol doesn't exist, let user know
    return !stock.error ? (
        //If stock does exist but old data is still on state, show Loading...
        //Otherwise show requested stock data
      stock.quote.symbol === match.params.stockSymbol.toUpperCase() ? (
        <div>
          <h1>Welcome to the {stock.quote.symbol} Page!</h1>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleStock)
