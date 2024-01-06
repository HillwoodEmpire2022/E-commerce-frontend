import { createSlice } from "@reduxjs/toolkit";
import { GetMyprofile } from "../../APIs/UserAPIs";
import { Updateprofile } from "../../APIs/UserAPIs";

const initialState = {
  profile: null,
  loadprofile: false,
  errprofile: null,
};

const getprofile = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetMyprofile.pending, (state, action) => {
        state.loadprofile = true;
      })
      .addCase(GetMyprofile.fulfilled, (state, action) => {
        state.loadprofile = false;
        state.profile = action.payload;
      })
      .addCase(GetMyprofile.rejected, (state, action) => {
        state.loadprofile = false;
        state.errprofile = action.error;
      });
  },
});

const updateprofile = createSlice({
  name: "updateprofile",
  initialState: {
    profileupdate: null,
    loadprofileupdate: false,
    errprofileupdate: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Updateprofile.pending, (state, action) => {
        state.loadprofileupdate = true;
      })
      .addCase(Updateprofile.fulfilled, (state, action) => {
        state.loadprofileupdate = false;
        state.profileupdate = action.payload;
      })
      .addCase(Updateprofile.rejected, (state, action) => {
        state.loadprofileupdate = false;
        state.errprofileupdate = action.error;
      });
  },
});

export const updateprofileReducer = updateprofile.reducer;
export const getProfileReducer = getprofile.reducer;
