import React, { useState } from "react";
import styles from "./ImageCarousel.module.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images, getImageUrl = null, width = "100%", height = "24rem" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 URL을 가져오는 함수
  const getImage = (image) => {
    if (getImageUrl) {
      return getImageUrl(image);
    }
    return image;
  };

  // 이미지 배열이 없거나 비어있는 경우 처리
  if (!images || images.length === 0) {
    return (
      <div
        className={styles.carouselContainer}
        style={{ width, height }}
      >
        <img
          src="https://placehold.co/400x300?text=이미지+없음"
          alt="이미지 없음"
          className={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x300?text=이미지+없음";
          }}
        />
      </div>
    );
  }

  // 이미지가 하나뿐인 경우 네비게이션 버튼 없이 이미지만 표시
  if (images.length === 1) {
    return (
      <div
        className={styles.carouselContainer}
        style={{ width, height }}
      >
        <img
          src={getImage(images[0])}
          alt="상품 이미지"
          className={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x300?text=이미지+없음";
          }}
        />
      </div>
    );
  }

  // 이전 이미지로 이동
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // 다음 이미지로 이동
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 특정 이미지로 직접 이동
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carouselContainer}
        style={{ width, height }}
      >
        <img
          src={getImage(images[currentIndex])}
          alt={`상품 이미지 ${currentIndex + 1}`}
          className={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x300?text=이미지+없음";
          }}
        />
        
        {/* 좌우 네비게이션 버튼 */}
        <button 
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={goToPrevious}
          aria-label="이전 이미지"
        >
          <FaChevronLeft />
        </button>
        
        <button 
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={goToNext}
          aria-label="다음 이미지"
        >
          <FaChevronRight />
        </button>
        
        {/* 이미지 인디케이터 (하단 점) */}
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ""}`}
              onClick={() => goToImage(index)}
              aria-label={`${index + 1}번 이미지로 이동`}
            ></button>
          ))}
        </div>
      </div>
      
      {/* 이미지 미리보기 (썸네일) */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${index === currentIndex ? styles.activeThumbnail : ""}`}
              onClick={() => goToImage(index)}
            >
              <img
                src={getImage(image)}
                alt={`썸네일 ${index + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=이미지+없음";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;