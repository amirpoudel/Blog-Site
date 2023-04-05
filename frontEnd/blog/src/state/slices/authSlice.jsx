
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isLoggedIn:false,
    user:{}
}

const authSlice  =  createSlice({
    name:'auth',
    initialState,
    reducers:{
        login(state,actions){
            state.isLoggedIn=true;
            state.user = actions.payload;
            console.log("State Data",actions.payload);
        },
        logout(state,actions){
            state.isLoggedIn = false
            state.user={}
        },
        
           
        
    },
        
    
});

export const {login,logout} = authSlice.actions

export default authSlice.reducer

