import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { EventSourcePolyfill } from "event-source-polyfill"; // SSE 헤더 지원을 위해 추가

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let eventSource;

        const initializeSse = () => {
            fetchNotifications();
            eventSource = setupSse();
        };

        if (isAuthenticated && userInfo?.memberId) {
            initializeSse();
        }

        return () => {
            if (eventSource) {
                console.log("Cleaning up SSE connection");
                eventSource.close();
            }
        };
    }, [isAuthenticated, userInfo]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch("http://localhost:8088/api/notifications", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` },
            });
            if (!response.ok) throw new Error("Failed to fetch notifications");
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const setupSse = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token available");
            return;
        }

        const eventSource = new EventSourcePolyfill("http://localhost:8088/api/notifications/stream", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            withCredentials: true,
            heartbeatTimeout: 60000,
        });

        eventSource.onopen = () => {
            console.log("SSE connection established");
        };

        eventSource.addEventListener("notification", (event) => {
            const newNotification = JSON.parse(event.data);
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + (newNotification.isRead ? 0 : 1));
        });

        // 하트비트 수신 확인용
        // eventSource.addEventListener("heartbeat", (event) => {
        //     console.log("Heartbeat received at:", new Date().toLocaleTimeString(), event.data);
        // });

        // eventSource는 onerror시 기본적으로 재연결 시도함
        eventSource.onerror = () => {
            console.error("SSE connection failed");
        };

        return eventSource; // 클린업용으로 반환
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:8088/api/notifications/${notificationId}/read`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` },
            });
            if (!response.ok) throw new Error("Failed to mark as read");
            setNotifications((prev) =>
                prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => prev - 1);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleLogout = async () => {
        if (logout) {
            await logout();
            navigate("/");
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("memberId");
            navigate("/");
            window.location.reload();
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                <div className={styles.flexContainer}>
                    <Link to="/" className={styles.logo}>
                        <span className={styles.primaryText}>중앙정보</span>
                        <span className={styles.foregroundText}>경매</span>
                    </Link>
                    <nav className={styles.desktopNav}>
                        <Link to="/ongoing-auctions" className={styles.navItem}>진행중인 경매</Link>
                        <Link to="/ended-auctions" className={styles.navItem}>종료된 경매</Link>
                        <Link to="/guide" className={styles.navItem}>이용가이드</Link>
                        <Link to="/reserved-auctions" className={styles.navItem}>
                            예약된 경매
                        </Link>
                    </nav>
                    <div className={styles.searchContainer}>
                        <input type="search" placeholder="검색" className={styles.searchInput} />
                    </div>
                    <div className={styles.buttonContainer}>
                        {isAuthenticated ? (
                            <>
                                <span className={styles.welcomeText}>
                                    {userInfo?.name || "사용자"}님 환영합니다
                                </span>
                                <div className={styles["icon-container"]} onClick={toggleNotifications}>
                                    <FontAwesomeIcon icon={faBell} className={styles.icon} />
                                    {unreadCount > 0 && (
                                        <span className={styles["unread-badge"]}>{unreadCount}</span>
                                    )}
                                </div>
                                {showNotifications && (
                                    <div className={styles["notification-list"]}>
                                        {notifications.length === 0 ? (
                                            <p className={styles["no-notifications"]}>새로운 알림이 없습니다.</p>
                                        ) : (
                                            notifications.slice(0, 5).map((notification) => (
                                                <div
                                                    key={notification.notificationId}
                                                    className={`${styles["notification-item"]} ${
                                                        notification.isRead ? styles.read : styles.unread
                                                    }`}
                                                    onClick={() => {
                                                        if (!notification.isRead) markAsRead(notification.notificationId);
                                                        if (notification.link) navigate(notification.link);
                                                    }}
                                                >
                                                    <p>{notification.message}</p>
                                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                                    {notification.safeNumber && (
                                                        <small>안심번호: {notification.safeNumber}</small>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                        <div className={styles["view-all"]}>
                                            <Link to="/mypage" onClick={() => setShowNotifications(false)}>
                                                전체 알림 보기
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <Link to="/mypage">
                                    <button className={styles.button}>마이페이지</button>
                                </Link>
                                <button onClick={handleLogout} className={styles.button}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><button className={styles.button}>로그인</button></Link>
                                <Link to="/signup"><button className={styles.button}>회원가입</button></Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;