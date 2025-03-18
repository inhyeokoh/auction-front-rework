import React from "react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useParams } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";
import WebSocketChat from "../components/ui/WebSocketChat.jsx";
import { useLoaderData } from 'react-router-dom';


const LiveAuction = () => {
    
    // useLoaderData를 사용하여 loader에서 반환한 데이터를 가져옴
    // loader는 화면 렌더링 이전에 발생 
    // useEffect는 화면 렌더링 후에 발생
    const getAuctionData = useLoaderData();

    console.log(`loaderData : ${JSON.stringify(getAuctionData)}`); //데이터 확인 
    console.log(getAuctionData.auctionInfo); 

    const auctionData = getAuctionData.auctionInfo; //경매방 데이터
        
    

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.productContainer}>
                    <div className={styles.videoContainer}>
                        <div className={styles.liveIndicator}>
                            LIVE
                        </div>
                        <img
                            src="https://images.samsung.com/kdp/goods/2024/07/07/144d6996-eefb-46c2-b305-34698e9514a0.png?$944_550_PNG$"
                            alt="물건이요"
                            className={styles.productImage}
                        />
                    </div>
                    <div className={styles.productInfo}>
                        <h1 className={styles.productTitle}>{auctionData.product.name}</h1>
                        <p className={styles.productDescription}>{auctionData.product.description}</p>
                    </div>
                </div>
                <WebSocketChat/>                
            </div>
        </div>
    );
};

export default LiveAuction;