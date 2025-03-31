import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../config/host-config";

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return rejectWithValue("No access token available");
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            return response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId, { rejectWithValue }) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return rejectWithValue("No access token available");
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
                headers: { "Authorization": `Bearer ${token}` },
                method: "PATCH",
            });
            if (!response.ok) throw new Error("Failed to mark as read");
            return notificationId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: {
        notifications: [],
        unreadCount: 0,
        status: "idle",
        error: null,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((n) => !n.isRead).length;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                const newData = action.payload.filter(
                    (newN) => !state.notifications.some((n) => n.notificationId === newN.notificationId)
                );
                state.notifications = [...newData, ...state.notifications];
                state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
                state.status = "succeeded";
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                console.error("Fetch notifications failed:", action.payload);
            })
            .addCase(markAsRead.pending, (state) => {
                state.status = "loading";
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map((n) =>
                    n.notificationId === action.payload ? { ...n, isRead: true } : n
                );
                state.unreadCount = Math.max(state.unreadCount - 1, 0);
                state.status = "succeeded";
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                console.error("Mark as read failed:", action.payload);
            });
    },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;