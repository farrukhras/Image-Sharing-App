import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null
    // {
    //   "_id": "63c8f595bd56f18f5e13145b",
    //   "username":"test",
    //   "email":"test@gmail.com",
    //   "password":"12345678",
    //   "profilePicture":"",
    //   "coverPicture":"",
    //   "followers":[],
    //   "followings":[],
    //   "isAdmin":false,
    // }
    ,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state, action) => {
      state.user = null;
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isFetching = false;
      state.error = false;
    },
    loginFail: (state, action) => {
      state.user = null;
      state.isFetching = false;
      state.error = action.payload;
    },
    resetState: (state) => {
      state.user = null;
      state.isFetching = false;
      state.error = false;
    },
    followUser: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload]
        }
      };
    }, 
    unFollowUser: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(following => following !== action.payload)
        }
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { loginStart, loginSuccess, loginFail, resetState, followUser, unFollowUser } = userSlice.actions

export default userSlice.reducer