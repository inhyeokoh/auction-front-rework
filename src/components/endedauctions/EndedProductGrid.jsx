import React from "react";
import EndedProductCard from "./EndedProductCard";

const EndedProductGrid = ({ products, getProductImage }) => {
  if (products.length === 0) {
    return <div className="empty-message">종료된 경매가 없습니다</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <EndedProductCard 
          key={product.productId} 
          product={product} 
          getProductImage={getProductImage} 
        />
      ))}
    </div>
  );
};

export default EndedProductGrid;