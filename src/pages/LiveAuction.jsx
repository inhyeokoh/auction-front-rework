import React from "react";
import Button from "../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";
import WebSocketChat from "../components/ui/WebSocketChat.jsx";
import { useLoaderData } from "react-router-dom";
import useSellerCheck from "../hook/useSellerCheck.jsx";
import { getProductImage } from "../components/auctiondetail/productUtils";
import ProductImage from "../components/auctiondetail/ProductImage.jsx";
import {AuthContext} from "../context/AuthContext.jsx";

const LiveAuction = () => {
    const navigate = useNavigate();
    const getAuctionData = useLoaderData();
    const auctionData = getAuctionData.auctionInfo;
    const isSeller = useSellerCheck(auctionData.product.memberId);
    const product = auctionData.product;
    const productId = product.productId

    const endAuction = async (productId) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                `http://localhost:8088/api/auction/closeAuction`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId }),
                }
            );
    
            if (!response.ok) {
                alert("경매 종료 실패");
                return false;
            }
    
            const data = await response.json();
            alert(data.message); // "경매가 종료되었습니다."

            return true;
        } catch (error) {
            alert("네트워크 오류 발생: " + error.message);
            return false;
        }
    };

    const handleAction = async () => {
        if (isSeller) {
            const success = await endAuction(productId);
            if (success) {
                navigate("/");
            }
        } else {
            navigate("/");
        }
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
                        <ProductImage
                            product={product}
                            getProductImage={getProductImage}
                            width="240px"
                            height="200px"
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