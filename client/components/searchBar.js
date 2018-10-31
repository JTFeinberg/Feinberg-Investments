import React, {Component} from 'react'
import {connect} from 'react-redux'

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
render() {
    return (
      <form id="search-bar">
          <input name="stockSymbol" maxLength="6"
            placeholder="Search Stock Symbols"/>
          <input type="submit" id="search-submit"/>
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
