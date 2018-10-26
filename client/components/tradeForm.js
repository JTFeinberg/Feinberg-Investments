import React, {Component} from 'react'
import {connect} from 'react-redux'

class TradeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      symbolInput: '',
      sharesInput: '',
      action: 'BUY'
    }
  }

  handleChange = ({target}) => {
      let {name, value} = target;
      this.setState({[name]: value})
  }

  render() {
    let {allsymbols, user} = this.props
    let {symbolInput, sharesInput, action} = this.state
    return (
      <div>
        <h1>Cash on Hand ${user.balance}</h1>
        <form>
          <input
            name="symbolInput"
            value={symbolInput}
            onChange={this.handleChange}
            maxLength="6"
            placeholder="Enter Stock Symbol Here"
          />
          <input
            name="sharesInput"
            value={sharesInput}
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
