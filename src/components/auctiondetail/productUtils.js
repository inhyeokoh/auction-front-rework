// 상품 이미지 URL 처리 함수
export const getProductImage = (product) => {
  let imageUrl = null;
  
  if (product.imageUrls && product.imageUrls.length > 0) {
    imageUrl = product.imageUrls[0];
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (product.mainImageUrl) {
    imageUrl = product.mainImageUrl;
  }
  
  if (imageUrl && !imageUrl.startsWith('http')) {
    return `http://localhost:8088${imageUrl}`;
  }
  
  return imageUrl || "https://placehold.co/400x300?text=이미지+없음";
};

// 상품 상세 정보 가져오기
export const fetchProductDetails = async (productId) => {
  const response = await fetch(`http://localhost:8088/api/product/${productId}`);
  
  if (!response.ok) {
    throw new Error('상품 정보를 불러오는데 실패했습니다');
  }
  
  const data = await response.json();
  return data.product;
};

// 경매 예약하기
export const reserveAuction = async (productId, token) => {
  const response = await fetch(`http://localhost:8088/api/auction/reserve/${productId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "경매 예약 중 오류가 발생했습니다.");
  }
  
  return await response.json();
};

// 경매 시작하기
export const startAuction = async (productId, token) => {
  const response = await fetch(`http://localhost:8088/api/auction/createAuction`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "경매 시작 중 오류가 발생했습니다.");
  }
  
  return await response.json();
};