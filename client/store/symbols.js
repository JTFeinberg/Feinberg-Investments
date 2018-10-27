import axios from 'axios'
import {IEX_API} from '../'

/**
 * ACTION TYPES
 */

const GET_SYMBOLS = 'GET_SYMBOLS'


/**
 * ACTION CREATORS
 */
const getAllSymbols = symbols => ({type: GET_SYMBOLS, payload: symbols})

/**
 * THUNK CREATORS
 */

export const fetchAllSymbolsThunk = () => async dispatch => {
  let res
  let symbols = new Set()
  try {
      res = await axios.get(`${IEX_API}/ref-data/symbols`)
      res.data.forEach(company => {
        symbols.add(company.symbol)
      });
      dispatch(getAllSymbols(symbols))
    } catch (err) {
        console.error(err)
    }
}

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_SYMBOLS:
      return action.payload
    default:
      return state
  }
}