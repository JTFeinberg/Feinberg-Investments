import React from 'react'
import {connect} from 'react-redux'
import Portfolio from './portfolio';

/**
 * COMPONENT
 */
// As of now this component has no real purpose. For now it's a place holder
//Hoping to add more features/components to the UserHome in the future
export const UserHome = () => {

  return (
    <div>
      <Portfolio />
    </div>
  )
}

/**
 * CONTAINER
 */

export default connect()(UserHome)

