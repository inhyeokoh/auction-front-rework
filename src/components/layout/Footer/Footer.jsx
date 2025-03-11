import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <Link to="/" className={styles.logo}>
                            <span className={styles.primaryText}>중앙정보</span>
                            <span className={styles.foregroundText}>경매</span>
                        </Link>
                        <p className={styles.description}>
                            라이브 경매의 혁신, 소통하며 만들어가는 거래 플랫폼
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h5 className={styles.heading}>Explore</h5>
                        <ul className={styles.list}>
                            <li><Link to="/auctions" className={styles.link}>모든 경매</Link></li>
                            <li><Link to="/categories" className={styles.link}>카테고리별</Link></li>
                            <li><Link to="/popular-auctions" className={styles.link}>인기 경매</Link></li>
                            <li><Link to="/ended-autions" className={styles.link}>종료된 경매</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h5 className={styles.heading}>계정</h5>
                        <ul className={styles.list}>
                            <li><Link to="/login" className={styles.link}>회원가입</Link></li>
                            <li><Link to="/mypage" className={styles.link}>마이페이지</Link></li>
                            <li><Link to="/register" className={styles.link}>물품등록</Link></li>
                        </ul>
                    </div>

                    <div className={styles.column}>
                    <h5 className={styles.heading}>정보</h5>
                        <ul className={styles.list}>
                            <li><Link to="/guide" className={styles.link}>이용가이드</Link></li>
                            <li><Link to="/about" className={styles.link}>문의</Link></li>
                            <li><Link to="/faq" className={styles.link}>FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomSection}>
                    <p className={styles.copyRight}>© {new Date().getFullYear()} 중앙정보경매. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link to="/terms" className={styles.bottomLink}>Terms</Link>
                        <Link to="/privacy" className={styles.bottomLink}>Privacy</Link>
                        <Link to="/cookies" className={styles.bottomLink}>Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;