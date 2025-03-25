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
  const response = await fetch(`http://localhost:8088/api/participants/reserve/${productId}`, {
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

// 경매 예약 상태 확인하기
export const checkReservationStatus = async (productId, token) => {
  const response = await fetch(`http://localhost:8088/api/participants/check/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "예약 상태 확인 중 오류가 발생했습니다.");
  }
  
  const data = await response.json();
  return data.data; // boolean 값 반환 (true: 예약됨, false: 예약되지 않음)
};

// API에서 상품 목록을 가져오는 함수
export const fetchProducts = async () => {
  const response = await fetch('http://localhost:8088/api/product/all');
  
  if (!response.ok) {
    throw new Error('상품 목록을 불러오는데 실패했습니다');
  }
  
  const data = await response.json();
  
// 진행 중인 경매만 필터링 (상태가 ONGOING인 상품만)
const filteredProducts = (data.products || []).filter(product => 
  product.auctionStatus === "ONGOING"
);
  
  console.log('전체 상품 수:', data.products?.length);
  console.log('필터링 후 상품 수:', filteredProducts.length);
  
  return filteredProducts;
};

// 예약자 수 가져오기 (수정)
export const fetchParticipantsCount = async (productId, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`http://localhost:8088/api/participants/count/${productId}`, {
      headers
    });
    
    if (!response.ok) {
      console.error(`참가자 수 조회 실패: 상태 코드 ${response.status}`);
      return 0;
    }
    
    const data = await response.json();
    console.log('참가자 수 API 응답:', data);
    
    // data.data에 참가자 수가 들어있음
    return data.data || 0;
  } catch (error) {
    console.error('참가자 수 조회 오류:', error);
    return 0;
  }
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

