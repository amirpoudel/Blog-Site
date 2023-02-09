
import { createReducer } from "@reduxjs/toolkit";

const initialState ={
    isLoggedIn:false,
}

export const authReducer = createReducer(initialState,{
    
        login : (state,action)=>{
            state.isLoggedIn=action.payload
        },

        logout : (state,action)=>{
            state.isLoggedIn=action.payload
        }
        
    

})