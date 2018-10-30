import React from 'react'
import {connect} from 'react-redux'
import {fetchTradedStockThunk} from '../store'

/**
 * COMPONENT
 */
export const TradeConfirmation = ({match, transaction, loadTransactionData}) => {
    if (!transaction.id) loadTransactionData(match.params.id)
  return transaction.id ? (
    <div>
     {`${transaction.id}`}
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

