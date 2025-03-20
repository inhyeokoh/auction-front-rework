import React from "react";
import styles from "../../styles/AuctionDetail.module.css";

const ProductImage = ({ product, getProductImage }) => {
  return (
    <div className={styles.imageContainer}>
      <img
        src={getProductImage(product)}
        alt={product.name}
        className={styles.productImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x300?text=이미지+없음";
        }}
      />
    </div>
  );
};

export default ProductImage;