import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx"
import styles from "../styles/LiveAuction.module.css";

const LiveAuction = () => {
    const { auctionId } = useParams();

    useEffect(() => {
    }, );


    return (
        <>
            <Button>전송</Button>
        </>
    );
};

export default LiveAuction;
