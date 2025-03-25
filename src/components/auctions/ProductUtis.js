// 상품 이미지 URL 처리 함수
export const getProductImage = (product) => {
  let imageUrl = null;
  
  // imageUrls 배열이 있고 첫 번째 이미지가 있는 경우
  if (product.imageUrls && product.imageUrls.length > 0) {
    imageUrl = product.imageUrls[0];
  }
  // 단일 이미지 URL이 있는 경우
  else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  }
  // 이전 버전과의 호환성을 위한 처리
  else if (product.mainImageUrl) {
    imageUrl = product.mainImageUrl;
  }
  
  // 이미지 URL이 있고, 외부 URL이 아닌 경우에만 서버 주소 추가
  if (imageUrl && !imageUrl.startsWith('http')) {
    return `http://localhost:8088${imageUrl}`;
  }
  
  return imageUrl || "https://placehold.co/400x300?text=이미지+없음";
};

// API에서 상품 목록을 가져오는 함수
export const fetchProducts = async () => {
  const response = await fetch('http://localhost:8088/api/product/all');
  
  if (!response.ok) {
    throw new Error('상품 목록을 불러오는데 실패했습니다');
  }
  
  const data = await response.json();
  return data.products || [];
};
