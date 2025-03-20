import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, getProductImage }) => {
  if (products.length === 0) {
    return <div className="empty-message">등록된 상품이 없습니다</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard 
          key={product.productId} 
          product={product} 
          getProductImage={getProductImage} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;