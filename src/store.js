import { createStore, applyMiddleware } from "redux"

import logger from "redux-logger"
import promise from "redux-promise-middleware"
import thunk from "redux-thunk"

import reducers from "./reducers"

//lilox
// const middleware = applyMiddleware(promise(), thunk)
const middleware = applyMiddleware(promise(), thunk, logger())

export default createStore(reducers, middleware)
