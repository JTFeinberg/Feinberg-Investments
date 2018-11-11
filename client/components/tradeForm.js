import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {IEX_API} from '../'
import {postTradedStockThunk, me} from '../store'

class TradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockSymbol: '',
      numOfShares: '',
      action: 'BUY',
      quote: {},
      isValidStock: false,
      isStockDirty: false
    }
  }
  
  handleChange = async ({target}) => {
    let {name, value} = target
    //By using the same values for the names of inputs as properties in the state,
    //we can just use [name] instead of having to check which write out each state property
    this.setState({[name]: value.toUpperCase()})
    //This is used as a front end validation to make sure that the symbol that has been typed in is a real one.
    if (name === 'stockSymbol' && value.length) {
      if (this.props.allSymbols.has(value.toUpperCase())) {
        let stockInfo = await axios.get(
          `${IEX_API}/stock/market/batch?symbols=${value}&types=quote`
        )
        this.setState({
          quote: stockInfo.data[value.toUpperCase()].quote,
          isValidStock: true
        })
      } else {
        this.setState({quote: {}, isValidStock: false})
      }
      //Checks is user has typed anything yet.
      this.setState({isStockDirty: true})
    }
  }

  //If the user doens't type in a whole number for shares, then we show this custom message
  isInteger = ({target}) => {
    if (target.validity.patternMismatch) {
      target.setCustomValidity('Please enter a whole number')
    } else {
      target.setCustomValidity('')
    }
  }

  render() {
    let {user, makeTrade} = this.props
    let {
      stockSymbol,
      numOfShares,
      action,
      isValidStock,
      isStockDirty,
      quote
    } = this.state
    return (
      <div className="trade-form-container">
        <h1>Cash on Hand ${Number(user.balance).toFixed(2)}</h1>
        {/* Only show error message is User types symbol that doesnt exist, and has actually typed something */}
        {!isValidStock && isStockDirty ? (
          <div>Please Enter a Valid Stock Symbol</div>
        ) : null}
        <form onSubmit={evt => makeTrade(evt, this.state, user.id)}>
          <input
            name="stockSymbol"
            value={stockSymbol}
            onChange={this.handleChange}
            maxLength="6"
            placeholder="Enter Stock Symbol"
          />
          <input
            name="numOfShares"
            value={numOfShares}
            onChange={this.handleChange}
            type="text"
            pattern="\d*"
            onInvalid={this.isInteger}
            onInput={this.isInteger}
            placeholder="Qty of Shares"
          />
          <select name="action" value={action} label="Action" onChange={this.handleChange}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input
            id="trade-submit"
            type="submit"
            value="Submit"
            // disable the submit button if the stock symbol is invalid, 
            //if nothing is typed, if no shares are entered, 
            //or is the user can't afford the purchase
            disabled={
              !isValidStock ||
              !stockSymbol.length ||
              !numOfShares ||
              user.balance < quote.latestPrice * numOfShares
            }
          />
        </form>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    allSymbols: state.symbols,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    makeTrade(evt, formInputs, userId) {
      evt.preventDefault()
      dispatch(postTradedStockThunk(formInputs, userId))
    },
    fetchUserData() {
      dispatch(me())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeForm)
