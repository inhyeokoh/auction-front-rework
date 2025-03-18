import { useState, useEffect } from "react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useParams } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";
import WebSocketChat from "../components/ui/WebSocketChat.jsx";


const LiveAuction = () => {
    const { id } = useParams();
    const [currentBid, setCurrentBid] = useState(0);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const product = { id: 1, initialPrice: 1000};
        if (product) {
            setProduct(product);
            setCurrentBid(product.initialPrice);
        }
    }, [id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const message = {
            id: Date.now().toString(),
            user: "User",
            content: newMessage,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, message]);
        setNewMessage("");
    };

    const handleBid = () => {
        if (!product) return;
        setCurrentBid(prev => prev + product.bidUnit);
    };

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
                        <h1 className={styles.productTitle}>물건이요</h1>
                        <p className={styles.productDescription}>설명이요</p>
                    </div>
                </div>
                <WebSocketChat/>                
            </div>
        </div>
    );
};

export default LiveAuction;