/*eslint-disable*/
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: null,
  token: null,
  userId: null,
  email:null,
  photo:null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
   setEmail: (state, action) => {
      state.email = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
    logout: state => {
      state.name = null;
      state.email = null;
      state.token = null;
      state.userId = null;
      state.photo = null;
    },
  },
});

export const {
  setName,
  setEmail,
  setToken,
  setUserId,
  logout,
  setPhoto
} = userSlice.actions;

export default userSlice.reducer;
