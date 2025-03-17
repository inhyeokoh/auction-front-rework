// src/pages/Auctions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auctions.css";

const Auctions = () => {
  const navigate = useNavigate();
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  return (
    <div>
      <div className="auctions-container">
        <div className="auctions-header">
          <h1 className="auctions-title">경매 리스트</h1>
          <button 
            onClick={() => navigate("/register-product")} 
            className="custom-button"
          >
            <span className="plus-icon">+</span>
            상품 등록
          </button>
        </div>
        
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="custom-card">
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
              <div className="product-content">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">₩{product.initialPrice.toLocaleString()}</span>
                  <button 
                    className="outline-button"
                    onClick={() => navigate(`/auction/${product.id}`)}
                  >
                    경매예약
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auctions;