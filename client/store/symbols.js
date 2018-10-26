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
  try {
      res = await axios.get(`${IEX_API}/ref-data/symbols`)
      dispatch(getAllSymbols(res.data))
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