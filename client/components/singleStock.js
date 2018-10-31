import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
const SingleStock = props => {

  return (
    <div>
      <h1>Welcome to the single Stock Page!</h1>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    stock: state.trade
  }
}

export default connect(mapState)(SingleStock)
