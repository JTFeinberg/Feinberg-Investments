import React from 'react'
import {connect} from 'react-redux'
import {fetchTradedStockThunk} from '../store'

/**
 * COMPONENT
 */
export const TradeConfirmation = ({match, transaction, loadTransactionData}) => {
  if (!transaction.id) loadTransactionData(match.params.id)
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

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    transaction: state.trade
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTransactionData(id) {
      dispatch(fetchTradedStockThunk(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeConfirmation)
