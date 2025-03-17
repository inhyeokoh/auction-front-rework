import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/LiveAuction.module.css";

const LiveAuction = () => {
    const { auctionId } = useParams();
    const [currentBid, setCurrentBid] = useState(0);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const products = fetch();
        const foundProduct = products.find((p) => p.id === auctionId);
        if (foundProduct) {
            setProduct(foundProduct);
            setCurrentBid(foundProduct.initialPrice);
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

    if (!product) return <div>Loading...</div>;

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.videoSection}>
                    <div className={styles.videoWrapper}>
                        <div className={styles.liveBadge}>LIVE</div>
                        <img src={product.image} alt={product.title} className={styles.videoImage} />
                    </div>
                    <div className={styles.videoDetails}>
                        <h1 className={styles.videoTitle}>{product.title}</h1>
                        <p className={styles.videoDescription}>{product.description}</p>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.bidSection}>
                        <div className={styles.bidLabel}>현재 입찰가</div>
                        <div className={styles.bidAmount}>₩{currentBid.toLocaleString()}</div>
                        <Button onClick={handleBid} className={styles.bidButton}>
                            +₩{product.bidUnit.toLocaleString()} 입찰하기
                        </Button>
                    </div>

                    <div className={styles.chatSection}>
                        <div className={styles.chatHeader}>실시간 채팅</div>
                        <div className={styles.chatMessages}>
                            {messages.map((message) => (
                                <div key={message.id} className={styles.chatMessage}>
                                    <div className={styles.chatMessageHeader}>
                                        <span className={styles.chatUser}>{message.user}</span>
                                        <span className={styles.chatTimestamp}>{message.timestamp}</span>
                                    </div>
                                    <p>{message.content}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className={styles.chatForm}>
                            <div className={styles.chatInputWrapper}>
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="메시지를 입력하세요..."
                                />
                                <Button type="submit">전송</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LiveAuction;
