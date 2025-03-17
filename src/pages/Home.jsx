import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx"

const Home = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>환영합니다!</h1>
            <p className={styles.description}>경매 사이트에 오신 것을 환영합니다. 여기서 다양한 경매에 참여하실 수 있습니다.</p>

            <h2 className={styles.subheading}>시작하기</h2>
            <ul className={styles.linkList}>
                <li className={styles.linkItem}>
                    <div>
                    <Link to="/ended-auctions">종료된 경매 보기</Link>
                    </div>
                </li>
                <li className={styles.linkItem}>
                    <Link to="/ongoing-auctions">진행 중인 경매 보기</Link>
                    <Input placeholder="음머"/>
                    <Button width={100} height={60}> 디자인 테스트 버튼 </Button>
                    <Button> 디자인 테스트 버튼 </Button>
                    <Button> 버튼 </Button>
                    <Button width="300" height={100} fontSize={1.5}> 디자인 테스트 버튼 </Button>

                </li>
            </ul>

            <h2 className={styles.subheading}>경매란?</h2>
            <p className={styles.description}>경매는 판매자가 상품을 판매하고, 참가자가 그 상품에 대해 입찰을 하는 방식입니다. 경매 종료 후 가장 높은 입찰자가 상품을 구매하게 됩니다.</p>
        </div>
    );
};

export default Home;