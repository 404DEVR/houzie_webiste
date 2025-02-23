import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

interface Subscription {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface SubscriptionState {
  selectedSubscription: Subscription | null;
}

const initialState: SubscriptionState = {
  selectedSubscription: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    selectSubscription: (state, action: PayloadAction<Subscription>) => {
      state.selectedSubscription = action.payload;
    },
    removeSubscription: (state) => {
      state.selectedSubscription = null;
    },
  },
});

export const { selectSubscription, removeSubscription } =
  subscriptionSlice.actions;

export const selectSelectedSubscription = (state: RootState) =>
  state.subscription.selectedSubscription;

export default subscriptionSlice.reducer;
