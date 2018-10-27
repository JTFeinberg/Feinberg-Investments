import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {IEX_API} from '../'
import {postTradedStockThunk} from '../store'

class TradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockSymbol: '',
      numOfShares: '',
      action: 'BUY',
      quote: {},
      isValidStock: false,
      isStockDirty: false,
    }
  }

  symbolChecker = (list, symbol)  => {
    // initial symbols for start, middle and end
    let start = 0
    let stop = list.length - 1
    let middle = Math.floor((start + stop) / 2)
    // While the middle is not what we're looking for and the list does not have a single item
    while (list[middle].symbol !== symbol && start < stop) {
      if (symbol < list[middle].symbol) {
        stop = middle - 1
      } else {
        start = middle + 1
      }
      // recalculate middle on every iteration
      middle = Math.floor((start + stop) / 2)
    }
    // if the current middle item is what we're looking for return it's index, else return -1
    return list[middle].symbol === symbol
  }

  handleChange = async ({target}) => {
      let {name, value} = target;
      this.setState({[name]: value.toUpperCase()})
      if (name === 'stockSymbol' && value.length && this.symbolChecker(this.props.allSymbols, value.toUpperCase())){
          let stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${value}&types=quote`)
          if (stockInfo.data[value.toUpperCase()]) {
            this.setState({quote: stockInfo.data[value.toUpperCase()].quote, isValidStock: true})
          } else {
            this.setState({quote: {}, isValidStock: false})
          }
          this.setState({isStockDirty: true})
      }
  }

  isInteger = ({target}) => {
    if(target.validity.patternMismatch){  
        target.setCustomValidity("Please enter a whole number");  
    }  
    else {  
        target.setCustomValidity("");  
    }                 
  }

  render() {
    let {allsymbols, user, makeTrade} = this.props
    let {stockSymbol, numOfShares, action, isValidStock, isStockDirty, quote} = this.state
    return (
      <div>
        <h1>Cash on Hand ${user.balance}</h1>
        <form onSubmit={(evt) => makeTrade(evt, this.state, user.id)}>
          <input
            name="stockSymbol"
            value={stockSymbol}
            onChange={this.handleChange}
            maxLength="6"
            placeholder="Enter Stock Symbol Here"
          />
          <input
            name="numOfShares"
            value={numOfShares}
            onChange={this.handleChange}
            type="text" pattern="\d*"
            onInvalid={this.isInteger}
            onInput={this.isInteger}
            placeholder="Qty of Shares"
          />
          <select name="action" value={action} onChange={this.handleChange}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input type="submit" value="Submit" disabled={!isValidStock || !stockSymbol.length || user.balance < quote.latestPrice * numOfShares} />
        </form>
    {!isValidStock && isStockDirty ? (<div>Please Enter a Valid Stock Symbol</div>) : null}
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
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(TradeForm)
