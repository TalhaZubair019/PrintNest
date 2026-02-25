import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/redux/CartSlice";
import wishlistReducer from "@/redux/WishListSlice";
import authReducer from "@/redux/AuthSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

