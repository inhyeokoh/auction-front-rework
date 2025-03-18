import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import styles from "../styles/RegisterProduct.module.css";

const RegisterProduct = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryType: "",
    startingPrice: "",
    bidIncrease: "",
    buyNowPrice: "",
    image: null, // 파일을 위한 상태
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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
      
      // 이미지 파일이 있으면 추가
      if (formData.image) {
        formDataToSend.append('productImage', formData.image);
      }

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
        navigate("/auctions");
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
          <div className={styles.formGroup}>
            <label htmlFor="productImage" className={styles.label}>상품 사진</label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={isSubmitting}
            />
            <div className={styles.imageUpload}>
              {!formData.image && (
                <div className={styles.imagePlaceholder}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.imageIcon}>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    <path d="M3 16l5-5c.928-.896 2.072-.896 3 0l3 3" />
                    <path d="M14 7h.01" />
                  </svg>
                </div>
              )}
              {formData.image && (
                <div className={styles.selectedImage}>
                  <span>{formData.image.name}</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            width={500} 
            type="submit" 
            className={styles.submitButton} 
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