import axios from 'axios'
import {IEX_API} from '../'


const defaultState = {quote: {symbol: 'Initial State'}}
/**
 * ACTION TYPES
 */

const GET_STOCK = 'GET_STOCK'
const RESET_STOCK = 'RESET_STOCK'

/**
 * ACTION CREATORS
 */
const getStock = stock => ({type: GET_STOCK, payload: stock})
const resetStock = state => ({type: RESET_STOCK, payload: state})
/**
 * THUNK CREATORS
 */

export const fetchStockThunk = (stockSymbol) => async dispatch => {
  let res
  try {
      res = await axios.get(`${IEX_API}/stock/${stockSymbol}/batch?types=quote,logo`)
      dispatch(getStock(res.data))
    } catch (err) {
        console.error(err)
        dispatch(getStock({error: err}))
    }
}

export const resetStockThunk = () => dispatch => dispatch(resetStock(defaultState))

/**
 * REDUCER
 */
export default function (state = defaultState, action) {
  switch (action.type) {
    case GET_STOCK:
      return action.payload
    case RESET_STOCK:
      return action.payload
    default:
      return state
  }
}