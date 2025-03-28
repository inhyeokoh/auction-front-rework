import { useState,  useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useNotifications = () => {
    const { userInfo} = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        const token = userInfo?.accessToken || localStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8088/api/notifications", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("알림을 가져오는데 실패했습니다");
            const data = await response.json();
            setNotifications((prev) => {
                // 중복 제거 후 병합
                const newData = data.filter((newN) => !prev.some((n) => n.notificationId === newN.notificationId));
                const updated = [...newData, ...prev];
                setUnreadCount(updated.filter((n) => !n.isRead).length);
                return updated;
            });
        } catch (error) {
            console.error("알림을 가져오는데 실패했습니다:", error);
        }
    }, [userInfo?.accessToken]);

    const markAsRead = useCallback(async (notificationId) => {
        const token = userInfo?.accessToken || localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:8088/api/notifications/${notificationId}/read`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                method: "PATCH"
            });
            if (!response.ok) throw new Error("알림을 읽음 처리하는데 실패했습니다");
            setNotifications((prev) =>
                prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(prev - 1, 0));
        } catch (error) {
            console.error("알림 읽음 처리 실패:", error);
        }
    }, [userInfo?.accessToken]);

    return { notifications, unreadCount, fetchNotifications, markAsRead, setNotifications, setUnreadCount };
};