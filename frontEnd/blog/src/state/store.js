import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/authenticationReducer'
import authSlice from './slices/authSlice';
 const store = configureStore({
  reducer: {
    authentication : authReducer,
    auth:authSlice
  },
})


export default store;