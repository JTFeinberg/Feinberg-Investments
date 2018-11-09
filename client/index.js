import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
export const IEX_API = 'https://api.iextrading.com/1.0'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
library.add(faSortUp, faSortDown)


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
