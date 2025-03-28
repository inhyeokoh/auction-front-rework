import React, { useEffect } from "react";
import styles from "../../styles/MyPage.module.css";
import { useNotifications } from "../../hook/useNotifications.jsx";

const NotificationsTab = () => {
  const { notifications, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
      fetchNotifications();
  }, [fetchNotifications]); // memberId가 변경될 때만 호출


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