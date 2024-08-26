import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GroupByState = {
  list: string[];
  fileName: null | string;
};

const initialState: GroupByState = {
  list: [],
  fileName: null,
};

export const groupBySlice = createSlice({
  name: 'groupBy',
  initialState,
  reducers: {
    setGroupBy: (state, action: PayloadAction<string[]>) => {
      state.list = action.payload;
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
  },
});

export const { setGroupBy, setFileName } =
  groupBySlice.actions;
export default groupBySlice.reducer;
