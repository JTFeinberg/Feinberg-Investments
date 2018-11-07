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
    this.setState({stockSymbol: target.value.toUpperCase()})
  }
  handleClick= (input) => {
    //This loads the data for the stock symbol the user is searching
    this.props.loadStockData(input)
    //After they click the search button we remove the input from the state/form
    this.setState({stockSymbol: ''})
  }
render() {
    const {stockSymbol} = this.state
    const {stocksMap, symbolsArr} = this.props
    const filteredStocks = symbolsArr.filter(symbol => symbol.match(stockSymbol))
    if(stockSymbol.length >1) console.log(filteredStocks)
    return (
      <div>
        <form id="search-bar" >
            <input name="stockSymbol" value={stockSymbol} onChange={this.handleChange} maxLength="6"
              placeholder="Search Stock Symbols"/>
              {/* Go to the singleStock component for the searched stock symbol when the user clicks search button */}
            <Link to={`/stock_info/${stockSymbol}`}><button id="search-bar-btn" onClick={() => this.handleClick(stockSymbol)}/></Link>
        </form>
        {stockSymbol.length > 2 ?
        (<ul>
          {filteredStocks.map(symbol => (
            <Link key={symbol} to={`/stock_info/${symbol}`}>
            <li onClick={() => this.handleClick(symbol)}>{symbol} {stocksMap.get(symbol)}</li>
            </Link>
          ))}
        </ul>) : null
        }
      </div>
    )
}
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    stocksMap: state.symbols,
    symbolsArr: Array.from(state.symbols.keys())
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
