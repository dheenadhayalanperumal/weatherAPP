import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
  },
  reducers: {
    setWeatherData(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;



// import { createStore } from 'redux';

// const initialState = {
//   movieId: 1,
// };

// function rootReducer(state = initialState, action) {
//   switch (action.type) {
//     case 'SET_MOVIE_ID':
//       return { ...state, movieId: action.payload };
//     default:
//       return state;
//   }
// }

// const store = createStore(rootReducer);

// export default store;