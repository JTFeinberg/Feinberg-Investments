import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const TradeConfirmation = ({transaction}) => {

  return (
    <div>
     {transaction}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    transaction: state.trade
  }
}

export default connect(mapState)(TradeConfirmation)

