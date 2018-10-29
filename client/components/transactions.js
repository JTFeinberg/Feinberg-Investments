import React from 'react'
import {connect} from 'react-redux'


/**
 * COMPONENT
 */
const Transactions = ({transactions}) => {
  return transactions.length ? (
    <div className="transactions-container">
      <h3>Transaction History</h3>
      <ul>
                <li>Action</li>
                <li>Stock Symbol</li>
                <li>Number of Shares</li>
                <li>Price Per Share</li>
                <li>Toal Value</li>
                <li>Date of Purchase</li>
            </ul>
      {transactions.map(currTrans => {
         return (
            <ul key={currTrans.id}>
                <li>{currTrans.action}</li>
                <li>{currTrans.stockSymbol}</li>
                <li>{`${currTrans.numOfShares} shares`}</li>
                <li>{`@ $${currTrans.price}`}</li>
                <li>{`$${currTrans.value}`}</li>
                <li>{`${currTrans.createdAt.split('T')[0]}`}</li>
            </ul>
          )
      })}
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
