import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/app/redux/CartSlice";
import wishlistReducer from "@/app/redux/WishListSlice";
import authReducer from "@/app/redux/AuthSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
