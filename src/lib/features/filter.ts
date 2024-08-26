import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Filter = {
  column: string;
  condition: string;
  value: string;
};

export type FilterState = {
  filters: Filter[];
  fileName: null | string;
};

const initialState: FilterState = {
  filters: [],
  fileName: null,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<Filter>) => {
      state.filters.push(action.payload);
    },
    updateFilter: (
      state,
      action: PayloadAction<{ index: number; filter: Filter }>
    ) => {
      state.filters.splice(action.payload.index, 1, action.payload.filter);
    },
    removeFilter: (state, action: PayloadAction<number>) => {
      state.filters.splice(action.payload, 1);
    },
    clearFilters: (state) => {
      state.filters = [];
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload;
    },
  },
});

export const { addFilter, updateFilter, removeFilter, clearFilters, setFileName } =
  filterSlice.actions;
export default filterSlice.reducer;
