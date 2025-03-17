import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import styles from "../styles/NotificationTest.module.css";

const NotificationTest = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationList, setNotificationList] = useState([]);

    // 기존 DB에서 알림 불러오기
    useEffect(() => {
        fetch(`http://localhost:8088/api/notifications/1`)
            .then((res) =>
                res.json()
            )
            .then((data) => {
                console.log("데이터", data);
                setNotificationList(data);
            })
            .catch((err) => console.error("알림 가져오기 실패:", err));
    }, []);

    useEffect(() => {
        // SSE를 사용하여 서버의 엔드포인트에 연결
        // const eventSource = new EventSource(`http://localhost:8088/sse/subscribe/${userId}`);
        const eventSource = new EventSource(`http://localhost:8088/sse/subscribe/1`);
        console.log("서버 엔드포인트에 연결", eventSource);

        eventSource.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            console.log("newNotification", newNotification);
            setNotifications((prevNotifications) => {
                const updatedNotifications = [newNotification, ...prevNotifications];
                setUnreadCount(updatedNotifications.filter((notif) => !notif.read).length);
                return updatedNotifications;
            });
        };

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [userId]);

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
    };

    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    return (
        <div className={styles.container}>
            {/* 내 소식 제목 */}
            <h2 className={styles.title}>내 소식</h2>

            {/* 알림 아이콘 */}
            <div className={styles["icon-container"]} onClick={toggleNotifications}>
                <FontAwesomeIcon icon={faBell} className={styles.icon} />
                {unreadCount > 0 && (
                    <span className={styles["unread-badge"]}>{unreadCount}</span>
                )}
            </div>

            {/* 드롭다운 알림 리스트 */}
            {showNotifications && (
                <div className={styles["notification-list"]}>
                    {notifications.length === 0 ? (
                        <p className={styles["no-notifications"]}>새로운 알림이 없습니다.</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                className={`${styles["notification-item"]} ${notification.read ? styles.read : styles.unread}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <p>{notification.message}</p>
                                <small>{new Date(notification.timestamp).toLocaleString()}</small>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* 알림 리스트 */}
            {
                <div className={styles["notification-list"]}>
                    {notificationList.length === 0 ? (
                        <p className={styles["no-notifications"]}>알림이 없습니다. {notificationList.length}</p>
                    ) : (
                        notificationList.map((notification) => (
                            <div
                                key={notification.notificationId}
                                className={`${styles["notification-item"]}`}
                            >
                                <p>{notification.message}</p>
                                <small>{new Date(notification.timestamp).toLocaleString()}</small>
                            </div>
                        ))
                    )}
                </div>
            }
        </div>
    );
};

export default NotificationTest;