import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.css';
import TopProducts from '../components/topproduct/TopProducts'; // 새로 만든 컴포넌트 임포트



const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // 상품 등록 버튼 클릭 핸들러
    const handleRegisterClick = () => {
        if (isAuthenticated) {
            navigate('/register-product');
        } else {
            alert('상품 등록을 위해서는 로그인이 필요합니다.');
            navigate('/login');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.heading}>실시간 라이브 경매에 오신 것을 환영합니다!</h1>
                <p className={styles.description}>
                    땅땅경매는 실시간으로 판매자와 소통하며 다양한 상품을 경매로 거래할 수 있는 플랫폼입니다.
                    지금 바로 경매에 참여하고 특별한 상품을 만나보세요.
                </p>
                <div className={styles.ctaButtons}>
                    <Link to="/ongoing-auctions" className={styles.primaryButton}>
                        진행중인 경매 보기
                    </Link>
                    <button 
                        onClick={handleRegisterClick} 
                        className={styles.secondaryButton}
                    >
                        상품 등록하기
                    </button>
                </div>
            </div>

            {/* 인기 상품 TOP 5 섹션 추가 */}
            <TopProducts />

            <div className={styles.infoSection}>
                <h2 className={styles.subheading}>경매란?</h2>
                <p className={styles.description}>
                    경매는 판매자가 상품을 출품하고, 여러 구매자가 입찰에 참여하여 가장 높은 가격을 제시한 
                    사람이 상품을 구매하는 방식입니다. 땅땅경매는 실시간 라이브 스트리밍을 통해 
                    판매자와 구매자 간의 직접적인 소통이 가능한 새로운 경매 플랫폼입니다.
                </p>
            </div>
            
            <div className={styles.featuresSection}>
                <h2 className={styles.subheading}>땅땅경매의 특징</h2>
                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <h3>실시간 소통</h3>
                        <p>판매자와 실시간으로 대화하며 상품에 대해 질문하고 확인할 수 있습니다.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h3>다양한 카테고리</h3>
                        <p>전자제품부터 패션, 예술품까지 다양한 카테고리의 상품을 만나볼 수 있습니다.</p>
                    </div>
                    <div className={styles.featureItem}>
                        <h3>안전한 거래</h3>
                        <p>검증된 판매자와 안전한 결제 시스템으로 믿을 수 있는 거래를 보장합니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;