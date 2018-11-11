import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchTradedStockThunk, me, fetchPortfolioThunk} from '../store'

/**
 * COMPONENT
 */
class TradeConfirmation extends Component {
  async componentDidMount() {
    let stockSymbolsStr 
      let {transaction, match, loadTransactionData, loadStockQuotes,fetchUserData} = this.props
      //If for some reason a user saves this url and they go back here, we need to load the transaction onto the state.
      //Otherwise just use what was saved from when the user clicked submit on the trade form. 
      if (!transaction.id) {
        await loadTransactionData(match.params.id)
      } else {
        //fetchUserData is for updating the users portfolio to reflect recent transactions 
        await fetchUserData()
        //stockSymbolsStr is passed in to loadStockQuotes to be used for a batch load of quotes from the IEX API
        //That endpoint uses a comma delimited string of symbols, hence the .join(',')
        stockSymbolsStr = this.props.stocks.map(currStock => currStock.stockSymbol).join(',')
        await loadStockQuotes(stockSymbolsStr)
      }
  }
  render() {
    const { transaction } = this.props
    return transaction.id ? (
      <div className="trade-confirmation-container">
        <h3>Transaction Confirmation</h3>
        <div className="trade-confirmation-wrapper">
  
        <ul className="trade-confirmation-col">
          <li className="shade-alternate">Action</li>
          <li>Stock Symbol</li>
          <li className="shade-alternate">Number of Shares</li>
          <li>Price Per Share</li>
          <li className="shade-alternate">Toal Value</li>
          <li>Date of Purchase</li>
        </ul>
        <ul className="trade-confirmation-col">
          <li className="shade-alternate">{transaction.action}</li>
          <li>{transaction.stockSymbol}</li>
          <li className="shade-alternate">{`${transaction.numOfShares} shares`}</li>
          <li>{`$${transaction.price}/share`}</li>
          <li className="shade-alternate">{`$${Number(transaction.value).toFixed(2)}`}</li>
          <li>{`${transaction.createdAt.split('T')[0]}`}</li>
        </ul>
        </div>
      </div>
    ) : (
      <div>
        <h1>LOADING...</h1>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    transaction: state.trade,
    stocks: state.user.portfolios
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTransactionData: (id) => dispatch(fetchTradedStockThunk(id)), 
    fetchUserData: () => dispatch(me()),
    loadStockQuotes: (ownedStockSymbols) => dispatch(fetchPortfolioThunk(ownedStockSymbols)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeConfirmation)
