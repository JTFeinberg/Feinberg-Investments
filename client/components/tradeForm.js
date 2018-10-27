import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

class TradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockSymbol: '',
      numOfShares: '',
      action: 'BUY'
    }
  }

  handleChange = ({target}) => {
      let {name, value} = target;
      this.setState({[name]: value})
  }

  handleSubmit = (evt) => {
      evt.preventDefault()
      const {
        action,
        stockSymbol,
        numOfShares,
        price
      } = this.state
      axios.post('/api/user/transaction', {
        action,
        stockSymbol,
        numOfShares,
        price: 100,
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
const mapState = state => {
  return {
    allSymbols: state.symbols,
    user: state.user
  }
}

export default connect(mapState)(TradeForm)
