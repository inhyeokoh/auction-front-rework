import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button"

const AuctionsHeader = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="auctions-header">
      <h1 className="auctions-title">경매 리스트</h1>
      
      {/* 로그인 상태일 때만 상품 등록 버튼 표시 */}
      {isAuthenticated && (
        <Button 
          onClick={() => navigate("/register-product")}
          width={120}
          height={40}
        >
          <span className="plus-icon">+</span>
          상품 등록
        </Button>
      )}
    </div>
  );
};

export default AuctionsHeader;