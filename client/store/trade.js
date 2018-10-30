import axios from 'axios'

/**
 * ACTION TYPES
 */

const TRADE_STOCK = 'TRADE_STOCK'


/**
 * ACTION CREATORS
 */
const tradeStock = stock => ({type: TRADE_STOCK, payload: stock})

/**
 * THUNK CREATORS
 */

export const postTradedStockThunk = (formInputs, userId) => async dispatch => {
  let res
  const {
    action,
    stockSymbol,
    numOfShares,
    quote
  } = formInputs
  try {
      res = await axios.post(`/api/user/transaction/${action.toLowerCase()}`, {
        action,
        stockSymbol,
        numOfShares,
        price: quote.latestPrice,
        userId
      })
      dispatch(tradeStock(res.data))
    } catch (err) {
        console.error(err)
    }
}

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case TRADE_STOCK:
      return action.payload
    default:
      return state
  }
}