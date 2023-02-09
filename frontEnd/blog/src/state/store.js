import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/authenticationReducer'
 const store = configureStore({
  reducer: {
    authentication : authReducer,
  },
})


export default store;