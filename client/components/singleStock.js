import React from 'react'
import {connect} from 'react-redux'
import {fetchPortfolioThunk} from '../store'

/**
 * COMPONENT
 */
const SingleStock = ({stock, match, loadStockData}) => {
    let {stockSymbol} = match.params
    loadStockData(stockSymbol)
  return stock[stockSymbol] ? (
    <div>
      <h1>Welcome to the {stock[stockSymbol].quote.symbol} Page!</h1>
    </div>
  ) : null
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    stock: state.portfolio
  }
}

const mapDispatchToProps = dispatch => {
    return {
      loadStockData(stockSymbol) {
          dispatch(fetchPortfolioThunk(stockSymbol))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(SingleStock)
