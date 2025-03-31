import React, { useState, useRef } from "react";
import Button from "../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";
import WebSocketChat from "../components/ui/WebSocketChat.jsx";
import { useLoaderData } from "react-router-dom";
import useSellerCheck from "../hook/useSellerCheck.jsx";
import { getProductImage } from "../components/auctiondetail/productUtils";
import ProductImage from "../components/auctiondetail/ProductImage.jsx";
import JanusWebRTC from "../components/WebRTC/JanusWebRTC.jsx";
import { API_BASE_URL } from "../config/host-config.js";

const LiveAuction = () => {
    const navigate = useNavigate();
    const getAuctionData = useLoaderData();
    const auctionData = getAuctionData.auctionInfo;
    const isSeller = useSellerCheck(auctionData.product.memberId);
    const product = auctionData.product;
    const productId = product.productId;
    const roomId = productId + 20000;
    const janusRef = useRef(null); // JanusWebRTC에 대한 ref 추가

    // 경매 상태 관리
    const [auctionStatus, setAuctionStatus] = useState("on");

    const endAuction = async (productId) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/auction/closeAuction`,
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
                // 경매 종료 시 상태 변경
                setAuctionStatus("end");

                // 경매 종료 성공 시 Janus 방 삭제
                if (janusRef.current) {
                    janusRef.current.destroyRoom();
                }
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
                        <JanusWebRTC
                            ref={janusRef} // ref 추가
                            roomId={roomId}
                            isPublisher={isSeller}
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
                <WebSocketChat auctionStatus={auctionStatus}/>
            </div>
        </div>
    );
};

export default LiveAuction;