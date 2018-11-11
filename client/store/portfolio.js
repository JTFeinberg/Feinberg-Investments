import axios from 'axios'
import {IEX_API} from '../'

/**
 * ACTION TYPES
 */

const GET_PORTFOLIO = 'GET_PORTFOLIO'
const REMOVE_PORTFOLIO = 'REMOVE_PORTFOLIO'


/**
 * ACTION CREATORS
 */
const getPortfolio = portfolio => ({type: GET_PORTFOLIO, payload: portfolio})
const removePortfolio = () => ({type: REMOVE_PORTFOLIO, payload: {}})

/**
 * THUNK CREATORS
 */

export const fetchPortfolioThunk = (stockSymbols) => async dispatch => {
  let res
  try {
      res = await axios.get(`${IEX_API}/stock/market/batch?symbols=${stockSymbols}&types=quote`)
      dispatch(getPortfolio(res.data))
    } catch (err) {
        console.error(err)
    }
}
export const removePortfolioThunk = () => dispatch => {
  dispatch(removePortfolio())
}
/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case GET_PORTFOLIO:
      return action.payload
    case REMOVE_PORTFOLIO:
      return action.payload
    default:
      return state
  }
}