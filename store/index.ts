import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import passwordReducer from './passwordReducer'
import departmentReducer from './departmentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    password: passwordReducer,
    departments: departmentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch