import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "@/Redux/AsyncThunk/Auth/SignUpAsyncThunk.js";
import {useSelector} from "react-redux";
import {selectJwtToken} from "@/Redux/Slice/Auth/SignInSlice.js";



export const getUserDetails=createAsyncThunk(
    'user/user-details',
    async (data,thunkAPI)=>{
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response=await fetch(`${baseUrl}/api/users/profile`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user details')
            }
            return await response.json();
        } catch (error) {
            thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const updateUserDetails=createAsyncThunk(
    'user/updateUserDetails',
    async (data,thunkAPI)=>{
        try {
            const state = thunkAPI.getState();
            const jwtToken = selectJwtToken(state);
            const response=await fetch(`${baseUrl}/api/users/update-profile-details`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user details')
            }
            return await response.json();
        } catch (error) {
            thunkAPI.rejectWithValue(error.message)
        }
    }
)

