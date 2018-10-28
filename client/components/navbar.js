import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout, fetchAllSymbolsThunk} from '../store'

const Navbar = ({handleClick, isLoggedIn, symbolsLoaded, loadAllSymbols}) => {
  if (symbolsLoaded) loadAllSymbols()
  return (
    <div>
      <nav>
      <h1>Feinberg Investments</h1>
        {isLoggedIn ? (
          <div className="nav-link-container">
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>
            <Link to="/user/transaction_history">Transactions</Link>
            <Link to= "/user/trade_form">Buy/Sell</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        ) : (
          <div className="nav-link-container">
            {/* The navbar will show these links before you log in */}
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
      <hr />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    symbolsLoaded: !state.symbols.length
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    loadAllSymbols: () => dispatch(fetchAllSymbolsThunk())
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
