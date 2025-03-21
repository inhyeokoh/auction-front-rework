import React from "react";

const ProductImage = ({ product, getProductImage, width = "100%", height = "24rem" }) => {
    return (
        <div
            className="mb-8 overflow-hidden rounded-lg" // 기본 스타일
            style={{ width, height }} // props로 크기 조절
        >
            <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-contain" // contain으로 비율 유지
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=이미지+없음";
                }}
            />
        </div>
    );
};

export default ProductImage;