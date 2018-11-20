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
    const regex = new RegExp(stockSymbol, 'gi')
    //Match stocks on either their symbol or the company name
    const filteredStocks = symbolsArr.filter(symbol => symbol.match(stockSymbol) || stocksMap.get(symbol).match(regex))
    return (
      <div>
        <form id="search-bar" >
            <input name="stockSymbol" value={stockSymbol} onChange={this.handleChange}
              placeholder="Search Stock Symbols"/>
              {/* Go to the singleStock component for the searched stock symbol when the user clicks search button */}
            <Link to={`/stock_info/${stockSymbol}`}><button id="search-bar-btn" onClick={() => this.handleClick(stockSymbol)}/></Link>
        </form>
        {stockSymbol.length > 1 ?
        (<ul id="search-bar-list">
          <li className="list-header">Quotes</li>
          {filteredStocks.map(symbol => { 
            const companyName = stocksMap.get(symbol)
            const indexOfSymbol = symbol.indexOf(stockSymbol)
            // Because the search string is always uppercase we need to change the case of the company name to find a match
            const indexOfCompany = companyName.toUpperCase().indexOf(stockSymbol)
            return (
              <Link key={symbol} to={`/stock_info/${symbol}`}>
                <li className="search-bar-list-item" onClick={() => this.handleClick(symbol)}>
                {/* If the search input is found in the stock symbol, then make it bold. Otherewise just render the symbol. */}
                  {indexOfSymbol > -1 ? 
                    <span className="list-symbol">{symbol.slice(0, indexOfSymbol)}
                      <strong>{stockSymbol}</strong>
                    {symbol.slice(indexOfSymbol + stockSymbol.length)}</span> 
                    :
                    <span className="list-symbol">{symbol}</span>}
                {/* If the search input is found in the company name, then make it bold. Otherewise just render the name. */}
                  {indexOfCompany > -1 ? 
                    <span className="list-name">{companyName.slice(0, indexOfCompany)}
                      <strong>{companyName.slice(indexOfCompany, stockSymbol.length)}</strong>
                    {companyName.slice(indexOfCompany + stockSymbol.length)}</span> 
                    :
                    <span className="list-name">{companyName}</span>}
                </li>
              </Link>
            )
          })}
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
