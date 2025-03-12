import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";


const Header = () => {
    // 스크롤 시 헤더 배경 반투명으로 변경하는 용도
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        <Link to="/login">
                            <button className={styles.button}>로그인</button>
                        </Link>
                        <Link to="/account">
                            <button className={styles.button}>회원</button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;