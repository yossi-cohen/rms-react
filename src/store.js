import { applyMiddleware, createStore } from "redux"

import logger from "redux-logger"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"

import reducers from "./reducers"

//lilox
// const middleware = applyMiddleware(promise(), thunk)
const middleware = applyMiddleware(promise(), thunk, logger())

export default createStore(reducers, middleware)
