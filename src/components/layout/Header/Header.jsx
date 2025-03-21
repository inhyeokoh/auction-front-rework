import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { AuthContext } from "../../../context/AuthContext";

const Header = () => {
    // 스크롤 시 헤더 배경 반투명으로 변경하는 용도
    const [isScrolled, setIsScrolled] = useState(false);
    
    // AuthContext 사용
    const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        if (logout) {
            // AuthContext의 logout 함수 사용
            await logout();
            navigate('/');
        } else {
            // 직접 처리 (AuthContext가 제대로 설정되지 않은 경우)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.removeItem('memberId');
            navigate('/');
            // 페이지 새로고침으로 상태 갱신
            window.location.reload();
        }
    };

    return (
        <header
            className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
        >
            <div className={styles.container}>
                <div className={styles.flexContainer}>
                    {/* Logo */}
                    <Link to="/" className={styles.logo}>
                        <span className={styles.primaryText}>중앙정보</span>
                        <span className={styles.foregroundText}>경매</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.desktopNav}>
                        <Link to="/ongoing-auctions" className={styles.navItem}>
                            진행중인 경매
                        </Link>
                        <Link to="/ended-auctions" className={styles.navItem}>
                            종료된 경매
                        </Link>
                        <Link to="/guide" className={styles.navItem}>
                            이용가이드
                        </Link>
                        <Link to="/notifications" className={styles.navItem}>
                            알림 테스트
                        </Link>
                        <Link to="/live-auction" className={styles.navItem}>
                            라이브 테스트
                        </Link>
                    </nav>

                    {/* Search and Login/Account Section */}
                    <div className={styles.searchContainer}>
                        <input
                            type="search"
                            placeholder="검색"
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        {isAuthenticated ? (
                            <>
                               <span className={styles.welcomeText}>
                                    {userInfo?.name || '사용자'}님 환영합니다
                                    {userInfo?.memberId && <span className={styles.memberIdText}> (ID: {userInfo.memberId})</span>}
                                </span>
                             <Link to="/mypage">
                                    <button className={styles.button}>마이페이지</button>
                                </Link>

                                {/* 로그인 상태일 때 */}
                             
                                <button 
                                    onClick={handleLogout} 
                                    className={styles.button}
                                >
                                    로그아웃
                                </button>
                               
                            </>
                        ) : (
                            <>
                                {/* 로그인하지 않은 상태일 때 */}
                                <Link to="/login">
                                    <button className={styles.button}>로그인</button>
                                </Link>
                                <Link to="/signup">
                                    <button className={styles.button}>회원가입</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;