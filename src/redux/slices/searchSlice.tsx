import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  location: string;
  propertyType: string[];
  configuration: string[];
  livingType: string[];
  minRent: number;
  maxRent: number;
}

const initialState: SearchState = {
  location: '',
  propertyType: [],
  configuration: [],
  livingType: [],
  minRent: 0,
  maxRent: 10000,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setPropertyType: (state, action: PayloadAction<string[]>) => {
      state.propertyType = action.payload;
    },
    setConfiguration: (state, action: PayloadAction<string[]>) => {
      state.configuration = action.payload;
    },
    setLivingType: (state, action: PayloadAction<string[]>) => {
      state.livingType = action.payload;
    },
    setMinRent: (state, action: PayloadAction<number>) => {
      state.minRent = action.payload;
    },
    setMaxRent: (state, action: PayloadAction<number>) => {
      state.maxRent = action.payload;
    },
    setRentRange: (
      state,
      action: PayloadAction<{ minRent: number; maxRent: number }>
    ) => {
      state.minRent = action.payload.minRent;
      state.maxRent = action.payload.maxRent;
    },
    clearSearch: (state) => {
      state.propertyType = [];
      state.configuration = [];
      state.livingType = [];
    },
  },
});

export const {
  setLocation,
  setPropertyType,
  setConfiguration,
  setLivingType,
  setMinRent,
  setMaxRent,
  setRentRange,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
