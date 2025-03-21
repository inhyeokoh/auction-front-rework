import React from "react";
import Button from "../components/ui/Button.jsx";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";
import WebSocketChat from "../components/ui/WebSocketChat.jsx";
import { useLoaderData } from "react-router-dom";
import useSellerCheck from "../hook/useSellerCheck.jsx";

const LiveAuction = () => {
    const navigate = useNavigate();
    const getAuctionData = useLoaderData();
    const auctionData = getAuctionData.auctionInfo;
    const isSeller = useSellerCheck(auctionData.product.memberId);

    const handleAction = () => {
        if (isSeller) {
            // 종료 로직 (백엔드 API 호출 추가 필요)
        }
        navigate(`/`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.productContainer}>
                    <div className={styles.videoContainer}>
                        <div className={styles.liveIndicator}>
                            <span className={styles.liveDot}></span>
                            LIVE
                        </div>
                        {/* 비디오 추가 - 실제 스트리밍 URL로 교체 필요 */}
                        <video
                            className={styles.liveVideo}
                            src="https://example.com/live-stream.mp4" // 임시 URL
                            autoPlay
                            muted
                            loop
                        />
                        <div className={styles.actionButtonContainer}>
                            <Button
                                className={`${styles.actionButton} ${isSeller ? styles.endButton : styles.exitButton}`}
                                onClick={handleAction}
                            >
                                {isSeller ? "경매 종료" : "나가기"}
                            </Button>
                        </div>
                    </div>
                    <div className={styles.productInfo}>
                        <img
                            src="https://images.samsung.com/kdp/goods/2024/07/07/144d6996-eefb-46c2-b305-34698e9514a0.png?$944_550_PNG$"
                            alt={auctionData.product.name}
                            className={styles.productThumbnail} // 썸네일 스타일 적용
                        />
                        <div className={styles.productDetails}>
                            <h1 className={styles.productTitle}>{auctionData.product.name}</h1>
                            <span className={styles.categoryTag}>{auctionData.product.categoryType}</span>
                            <p className={styles.productDescription}>{auctionData.product.description}</p>
                        </div>
                    </div>
                </div>
                <WebSocketChat />
            </div>
        </div>
    );
};

export default LiveAuction;