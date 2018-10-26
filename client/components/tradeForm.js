import React, {Component} from 'react'
import {connect} from 'react-redux'

class TradeForm extends Component {
 constructor(props){
     super(props)
     this.state = {
        symbolInput: "",
        sharesInput: "",
      };
 }


 render() {
     let {allsymbols, user} = this.props
     return (
       <div>
           <h1>Cash on Hand {user.balance}</h1>
       <form>
           <input name="symbolInput" maxLength="6" placeholder="Enter Stock Symbol Here"/>
           <input name="shares" type="number" maxLength="10" placeholder="Qty of Shares"/>
           <select name="action">
               <option value="BUY">BUY</option>
               <option value="SELL">SELL</option>
           </select>
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
