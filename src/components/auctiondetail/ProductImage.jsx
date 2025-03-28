import React from "react";
import ImageCarousel from "./ImageCarousel";
import { API_BASE_URL } from "../../config/host-config";
const ProductImage = ({ product, getProductImage, width = "100%", height = "24rem" }) => {
    // 상품 이미지 배열 생성
    const getProductImages = () => {
        const images = [];
        
        // imageUrls 배열이 있는 경우
        if (product.imageUrls && product.imageUrls.length > 0) {
            return product.imageUrls;
        }
        
        // 단일 이미지만 있는 경우 (imageUrl 또는 mainImageUrl)
        if (product.imageUrl) {
            images.push(product.imageUrl);
        } else if (product.mainImageUrl) {
            images.push(product.mainImageUrl);
        }
        
        return images;
    };

    // 문자열 URL을 처리하는 함수
    const processImageUrl = (url) => {
        // 문자열이 아닌 경우 처리
        if (typeof url !== 'string') {
            return "https://placehold.co/400x300?text=이미지+없음";
        }
        
        // URL이 http로 시작하지 않으면 서버 주소 추가
        if (!url.startsWith('http')) {
            return `${API_BASE_URL}${url}`;
        }
        
        return url;
    };

    // 사용할 이미지 배열
    const images = getProductImages();

    return (
        <ImageCarousel 
            images={images}
            getImageUrl={processImageUrl}
            width={width}
            height={height}
        />
    );
};

export default ProductImage;