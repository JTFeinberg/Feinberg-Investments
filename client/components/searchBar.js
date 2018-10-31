import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchStockThunk} from '../store'


/**
 * COMPONENT
 */
class SearchBar extends Component {
  constructor(props) {
      super(props)
      this.state = {
          stockSymbol: ''
      }
  }
  handleChange = ({target}) => {
    let {name, value} = target
    this.setState({[name]: value.toUpperCase()})
  }
  handleClick= (input) => {
    this.props.loadStockData(input)
    this.setState({stockSymbol: ''})
  }
render() {
    const {stockSymbol} = this.state
    return (
      <form id="search-bar" >
          <input name="stockSymbol" value={stockSymbol} onChange={this.handleChange} maxLength="6"
            placeholder="Search Stock Symbols"/>
          <Link to={`/stock_info/${stockSymbol}`}><button id="search-bar-btn" onClick={() => this.handleClick(stockSymbol)}/></Link>
      </form>
    )
}
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    symbols: state.symbols
  }
}

const mapDispatchToProps = dispatch => {
    return {
      loadStockData(stockSymbol) {
        dispatch(fetchStockThunk(stockSymbol))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
