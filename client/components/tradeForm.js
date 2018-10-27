import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {IEX_API} from '../'

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
      console.log(value)
      this.setState({[name]: value})
      if (name === 'stockSymbol' && value.length){
          let stockInfo = await axios.get(`${IEX_API}/stock/market/batch?symbols=${value}&types=quote`)
          if (stockInfo.data[value.toUpperCase()]) {
            this.setState({quote: stockInfo.data[value.toUpperCase()].quote, isValidStock: ''})
          } else {
            this.setState({quote: {}, isValidStock: 'Please Enter a Valid Stock Symbol'})
          }
      }
     
  }

  handleSubmit = (evt) => {
      evt.preventDefault()
      const {
        action,
        stockSymbol,
        numOfShares,
        quote
      } = this.state
      axios.post('/api/user/transaction', {
        action,
        stockSymbol,
        numOfShares,
        price: quote.latestPrice,
        userId: this.props.user.id
      })
      .then(res => res.data)
      .then(completedTransaction => {

          console.log(completedTransaction)
      })
  }

  render() {
    let {allsymbols, user} = this.props
    let {stockSymbol, numOfShares, action} = this.state
    return (
      <div>
        <h1>Cash on Hand ${user.balance}</h1>
        <form onSubmit={this.handleSubmit}>
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

export default connect(mapStateToProps)(TradeForm)
