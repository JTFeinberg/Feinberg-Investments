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
      isValidStock: ''
    }
  }

  handleChange = async ({target}) => {
      let {name, value} = target;
      this.setState({[name]: value.toUpperCase()})
      if (name === 'stockSymbol' && value.length){
          let stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${value}&types=quote`)
          if (stockInfo.data[value.toUpperCase()]) {
            this.setState({quote: stockInfo.data[value.toUpperCase()].quote, isValidStock: ''})
          } else {
            this.setState({quote: {}, isValidStock: 'Please Enter a Valid Stock Symbol'})
          }
      }
     
  }

  render() {
    let {allsymbols, user, makeTrade} = this.props
    let {stockSymbol, numOfShares, action} = this.state
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
            maxLength="10"
            placeholder="Qty of Shares"
          />
          <select name="action" value={action} onChange={this.handleChange}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input type="submit" value="Submit"/>
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
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(TradeForm)
