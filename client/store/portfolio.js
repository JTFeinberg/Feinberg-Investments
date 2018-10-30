import axios from 'axios'
import {IEX_API} from '../'

/**
 * ACTION TYPES
 */

const GET_PORTFOLIO = 'GET_PORTFOLIO'


/**
 * ACTION CREATORS
 */
const getPortfolio = portfolio => ({type: GET_PORTFOLIO, payload: portfolio})

/**
 * THUNK CREATORS
 */

export const fetchPorfolioThunk = (stockSymbols) => async dispatch => {
  let res
  try {
      res = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbols}&types=quote`)
      dispatch(getPortfolio(res.data))
    } catch (err) {
        console.error(err)
    }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.payload
    default:
      return state
  }
}