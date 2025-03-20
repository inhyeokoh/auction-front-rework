import React from "react";
import styles from "../../styles/MyPage.module.css";

const NotificationsTab = () => {
  // 더미 알림 데이터
  const notifications = [
    {
      id: 1,
      message: "회원님의 '상품 이름 1' 경매가 시작되었습니다.",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30분 전
    },
    {
      id: 2,
      message: "회원님이 입찰한 '상품 이름 2'에 새로운 입찰자가 있습니다.",
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2시간 전
    },
    {
      id: 3,
      message: "축하합니다! '상품 이름 3' 경매에서 낙찰되셨습니다.",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1일 전
    },
    {
      id: 4,
      message: "'상품 이름 4' 판매가 완료되었습니다. 정산이 진행됩니다.",
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3일 전
    }
  ];

  // 시간 형식 변환 함수
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return '방금 전';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    }
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>내 소식</h2>
      {notifications.length > 0 ? (
        <div className={styles.notificationList}>
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
            >
              <div className={styles.notificationContent}>
                <p className={styles.message}>{notification.message}</p>
                <span className={styles.timeAgo}>{formatTimeAgo(notification.timestamp)}</span>
              </div>
              {!notification.read && <span className={styles.unreadDot}></span>}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          새로운 알림이 없습니다.
        </div>
      )}
    </>
  );
};

export default NotificationsTab;