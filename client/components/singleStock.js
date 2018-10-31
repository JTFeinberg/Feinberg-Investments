import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPortfolioThunk} from '../store'

/**
 * COMPONENT
 */
class SingleStock extends Component {
    componentDidMount(){
        const {match, loadStockData} = this.props
        loadStockData(match.params.stockSymbol)
    }
  render() {
    const {stock, match} = this.props
    const {stockSymbol} = match.params
      return stock[stockSymbol] ? (
        <div>
          <h1>Welcome to the {stock[stockSymbol].quote.symbol} Page!</h1>
        </div>
      ) : null
  }
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
