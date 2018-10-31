import axios from 'axios'
import {IEX_API} from '../'

/**
 * ACTION TYPES
 */

const GET_STOCK = 'GET_STOCK'


/**
 * ACTION CREATORS
 */
const getStock = stock => ({type: GET_STOCK, payload: stock})

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

/**
 * REDUCER
 */
export default function (state = {quote: {symbol: 'Initial State'}}, action) {
  switch (action.type) {
    case GET_STOCK:
      return action.payload
    default:
      return state
  }
}