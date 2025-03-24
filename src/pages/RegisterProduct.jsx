import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import styles from "../styles/RegisterProduct.module.css";
import { FaUpload, FaTimesCircle } from "react-icons/fa";

const RegisterProduct = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryType: "",
    startingPrice: "",
    bidIncrease: "",
    buyNowPrice: "",
    images: [], // 다중 이미지를 위한 배열
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;
    
    // 이미지 파일 검증
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== selectedFiles.length) {
      alert("이미지 파일만 업로드 가능합니다.");
    }
    
    // 기존 이미지에 새 이미지 추가
    const newImages = [...formData.images, ...validFiles];
    setFormData({ ...formData, images: newImages });
    
    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]); // 메모리 누수 방지
    newPreviewUrls.splice(index, 1);
    
    setFormData({ ...formData, images: newImages });
    setPreviewUrls(newPreviewUrls);
    
    // 현재 선택된 이미지가 삭제된 경우 인덱스 조정
    if (currentImageIndex >= newPreviewUrls.length) {
      setCurrentImageIndex(Math.max(0, newPreviewUrls.length - 1));
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length === 0) return;
    
    // 이미지 파일 검증
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      alert("이미지 파일만 업로드 가능합니다.");
    }
    
    // 기존 이미지에 새 이미지 추가
    const newImages = [...formData.images, ...validFiles];
    setFormData({ ...formData, images: newImages });
    
    // 미리보기 URL 생성
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert("로그인이 필요합니다. 상품을 등록하려면 먼저 로그인해주세요.");
      navigate("/login");
      return;
    }

    // 입력값 검증
    if (!formData.name || !formData.description || !formData.categoryType || 
        !formData.startingPrice || !formData.bidIncrease || !formData.buyNowPrice) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (formData.images.length === 0) {
      alert("최소 한 개 이상의 상품 이미지를 등록해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // accessToken 가져오기
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }
      
      // FormData 객체 생성
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.name);
      formDataToSend.append('productDescription', formData.description);
      formDataToSend.append('productCategory', formData.categoryType);
      formDataToSend.append('productStartingPrice', formData.startingPrice);
      formDataToSend.append('productBidIncrement', formData.bidIncrease);
      formDataToSend.append('productBuyNowPrice', formData.buyNowPrice);
      
      // 모든 이미지를 'images' 파라미터로 추가
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      // API 호출 - 실제 서버에 상품 등록
      const response = await fetch('http://localhost:8088/api/product/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` // JWT 토큰 포함
          // Content-Type 헤더는 FormData를 사용할 때 자동으로 설정됨
        },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "상품이 성공적으로 등록되었습니다.");
        navigate("/ongoing-auctions");
      } else {
        // 에러 처리
        if (response.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        } else {
          const errorData = await response.json();
          alert(`상품 등록 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
        }
      }
    } catch (error) {
      console.error("상품 등록 중 오류:", error);
      alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 캐러셀 네비게이션
  const goToNextImage = () => {
    if (previewUrls.length > 1 && currentImageIndex < previewUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToPrevImage = () => {
    if (previewUrls.length > 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.heading}>상품 등록</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>상품명</label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>상품 설명</label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryType" className={styles.label}>카테고리</label>
            <select
              id="categoryType"
              className={styles.select}
              value={formData.categoryType}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="">카테고리 선택</option>
              <option value="ELECTRONICS">전자기기</option>
              <option value="FASHION">패션/의류</option>
              <option value="HOME">홈/리빙</option>
              <option value="BEAUTY">뷰티</option>
              <option value="SPORTS">스포츠</option>
              <option value="BOOKS">도서</option>
              <option value="TOYS">장난감</option>
              <option value="OTHERS">기타</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startingPrice" className={styles.label}>경매 초기가격</label>
            <Input
              id="startingPrice"
              type="number"
              value={formData.startingPrice}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bidIncrease" className={styles.label}>경매 단위</label>
            <Input
              id="bidIncrease"
              type="number"
              value={formData.bidIncrease}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="buyNowPrice" className={styles.label}>즉시 구매 가격</label>
            <Input
              id="buyNowPrice"
              type="number"
              value={formData.buyNowPrice}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* 개선된 이미지 업로드 영역 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>상품 사진 ({formData.images.length}개)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className={styles.hiddenFileInput}
              disabled={isSubmitting}
            />
            
            <div 
              className={`${styles.imageUploadArea} ${isDragging ? styles.dragging : ''}`}
              onClick={handleImageClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrls.length === 0 ? (
                <div className={styles.imageUploadPlaceholder}>
                  <FaUpload className={styles.uploadIcon} />
                  <p>이미지를 업로드하려면 클릭하거나 여기로 드래그하세요</p>
                  <p className={styles.supportedFormats}>지원 형식: JPG, PNG, GIF</p>
                </div>
              ) : (
                <div className={styles.imagePreviewContainer}>
                  <div className={styles.imagePreview}>
                    <img src={previewUrls[currentImageIndex]} alt="상품 이미지 미리보기" />
                    
                    <button 
                      type="button" 
                      className={`${styles.carouselButton} ${styles.removeButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(currentImageIndex);
                      }}
                    >
                      <FaTimesCircle />
                    </button>
                    
                    {previewUrls.length > 1 && (
                      <>
                        {currentImageIndex > 0 && (
                          <button 
                            type="button" 
                            className={`${styles.carouselButton} ${styles.prevButton}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              goToPrevImage();
                            }}
                          >
                            &lt;
                          </button>
                        )}
                        
                        {currentImageIndex < previewUrls.length - 1 && (
                          <button 
                            type="button" 
                            className={`${styles.carouselButton} ${styles.nextButton}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              goToNextImage();
                            }}
                          >
                            &gt;
                          </button>
                        )}
                        
                        <div className={styles.imagePagination}>
                          {previewUrls.map((_, index) => (
                            <span 
                              key={index} 
                              className={`${styles.paginationDot} ${currentImageIndex === index ? styles.activeDot : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className={styles.imageInfo}>
                    <p className={styles.imageName}>
                      {formData.images[currentImageIndex]?.name}
                    </p>
                    <p className={styles.imageCount}>
                      {currentImageIndex + 1} / {previewUrls.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {previewUrls.length > 0 && (
              <div className={styles.imageThumbnails}>
                {previewUrls.map((url, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnailContainer} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={url}
                      alt={`썸네일 ${index + 1}`}
                      className={styles.thumbnail}
                    />
                    <button
                      type="button"
                      className={styles.thumbnailRemove}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div 
                  className={styles.addThumbnail}
                  onClick={handleImageClick}
                >
                  <span>+</span>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            width={200}
            height={40}
            type="submit" 
            disabled={isSubmitting}
            
          >
            {isSubmitting ? '처리 중...' : '상품 등록하기'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default RegisterProduct;