import { useState, useEffect } from "react";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useParams } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";

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

                {/*입찰, 채팅 부분*/}
                {/*<div className={styles.sidebar}>*/}
                {/*    <div className={styles.bidPanel}>*/}
                {/*        <div className={styles.bidLabel}>현재 입찰가</div>*/}
                {/*        <div className={styles.currentBid}>*/}
                {/*            ₩{currentBid.toLocaleString()}*/}
                {/*        </div>*/}
                {/*        <Button onClick={handleBid} className={styles.bidButton}>*/}
                {/*            +₩{1000} 입찰하기*/}
                {/*        </Button>*/}
                {/*    </div>*/}

                {/*    <div className={styles.chatContainer}>*/}
                {/*        <div className={styles.chatHeader}>*/}
                {/*            <h2 className={styles.chatTitle}>실시간 채팅</h2>*/}
                {/*        </div>*/}
                {/*        <div className={styles.messageList}>*/}
                {/*            {messages.map((message) => (*/}
                {/*                <div key={message.id} className={styles.message}>*/}
                {/*                    <div className={styles.messageHeader}>*/}
                {/*                        <span className={styles.username}>{message.user}</span>*/}
                {/*                        <span className={styles.timestamp}>{message.timestamp}</span>*/}
                {/*                    </div>*/}
                {/*                    <p className={styles.messageContent}>{message.content}</p>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*        <form onSubmit={handleSendMessage} className={styles.messageForm}>*/}
                {/*            <div className={styles.inputGroup}>*/}
                {/*                <Input*/}
                {/*                    value={newMessage}*/}
                {/*                    onChange={(e) => setNewMessage(e.target.value)}*/}
                {/*                    placeholder="메시지를 입력하세요..."*/}
                {/*                    className={styles.messageInput}*/}
                {/*                />*/}
                {/*                <Button type="submit" className={styles.sendButton}>전송</Button>*/}
                {/*            </div>*/}
                {/*        </form>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default LiveAuction;