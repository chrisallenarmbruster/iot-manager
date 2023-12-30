import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import logger from "redux-logger"
import deviceAll from "./deviceAll"
import deviceCurrentValues from "./deviceCurrentValues"
import deviceSingle from "./deviceSingle"
import eventAll from "./eventAll"

const reducer = combineReducers({
  deviceAll,
  deviceCurrentValues,
  deviceSingle,
  eventAll,
})

// Compose enhancers with trace option enabled
const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : compose

const enhancer = composeEnhancers(applyMiddleware(thunk, logger))

const store = createStore(reducer, enhancer)

export default store
