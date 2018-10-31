import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

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
  handleSubmit = (evt) => {
    evt.preventDefault()
    this.props.history.push(`/stock_info/${evt.target.value}`)
  }
render() {
    const {stockSymbol} = this.state
    return (
      <form id="search-bar">
          <input name="stockSymbol" value={stockSymbol} onChange={this.handleChange} maxLength="6"
            placeholder="Search Stock Symbols"/>
          <Link to={`/stock_info/${stockSymbol}`}>LINK</Link>
      </form>
    )
}
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    symbols: state.symbols
  }
}

export default connect(mapState)(SearchBar)
