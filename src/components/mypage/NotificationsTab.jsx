import React, { useState, useEffect, useContext } from "react";
import styles from "../../styles/MyPage.module.css";
import { AuthContext } from "../../context/AuthContext";

const NotificationsTab = () => {
  const { userInfo } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userInfo?.memberId) {
      fetchNotifications();
      setupSse();
    }
  }, [userInfo]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8088/notifications", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const setupSse = () => {
    const token = localStorage.getItem("accessToken");
    const eventSource = new EventSource(`http://localhost:8088/notifications/stream?token=${token}`);
    eventSource.addEventListener("notification", (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    });
    return () => eventSource.close();
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8088/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` },
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) =>
          prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
      <>
        <h2 className={styles.sectionTitle}>내 소식</h2>
        {notifications.length > 0 ? (
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                  <div
                      key={notification.notificationId}
                      className={`${styles.notificationItem} ${
                          notification.isRead ? styles.read : styles.unread
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.notificationId)}
                  >
                    <div className={styles.notificationContent}>
                      <p className={styles.message}>{notification.message}</p>
                      <span className={styles.timeAgo}>
                  {formatTimeAgo(notification.createdAt || new Date())}
                </span>
                      {notification.safeNumber && (
                          <p className={styles.safeNumber}>안심번호: {notification.safeNumber}</p>
                      )}
                    </div>
                    {!notification.isRead && <span className={styles.unreadDot}></span>}
                  </div>
              ))}
            </div>
        ) : (
            <div className={styles.emptyState}>새로운 알림이 없습니다.</div>
        )}
      </>
  );
};

export default NotificationsTab;