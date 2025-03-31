import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "../features/notifications/notificationsSlice.js";

export const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
    },
});