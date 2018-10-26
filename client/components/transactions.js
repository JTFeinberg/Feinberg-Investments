import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
const Transactions = ({transactions}) => {

  return transactions.length ? (
    <div>
      <h3>Welcome to your transaction history</h3>
    </div>
  ) : ( 
  <div>
    <h3>You have no transaction histrory</h3>
    <h3>Click here to begin trading!</h3>
  </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    transactions: state.user.transactions
  }
}

export default connect(mapState)(Transactions)
