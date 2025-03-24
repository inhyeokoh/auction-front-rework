// 카테고리 영어 이름을 한글로 변환하는 매핑 객체
export const categoryMapping = {
  "ELECTRONICS": "전자기기",
  "FASHION": "패션/의류",
  "HOME": "홈/리빙",
  "BEAUTY": "뷰티",
  "SPORTS": "스포츠",
  "BOOKS": "도서",
  "TOYS": "장난감",
  "OTHERS": "기타"
};

// 카테고리 영어 이름을 한글로 변환하는 함수
export const getCategoryNameInKorean = (englishCategoryName) => {
  // 대문자로 변환하여 일관성 있게 처리
  const uppercaseCategory = englishCategoryName?.toUpperCase();
  
  // 매핑된 한글 이름이 있으면 반환, 없으면 원래 이름 그대로 반환
  return categoryMapping[uppercaseCategory] || englishCategoryName || "카테고리 없음";
};