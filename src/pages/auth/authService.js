/**
 * 인증 관련 API 호출을 담당하는 서비스
 */
const BASE_URL = 'http://localhost:8088/api/auth';

// API 요청 기본 설정
const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 쿠키 포함
    ...options
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, defaultOptions);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API 요청 중 오류:', error);
    throw error;
  }
};

// 로그인 요청
export const login = async (credentials) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

// 로그아웃 요청
export const logout = async () => {
  return apiRequest('/logout', { method: 'POST' });
};

// 회원가입 요청
export const signup = async (userData) => {
  return apiRequest('/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// 중복 확인 요청
export const checkDuplicate = async (type, value) => {
  return apiRequest(`/check-duplicate?type=${type}&value=${value}`);
};

// 인증 상태 확인
export const checkAuthStatus = async () => {
  return apiRequest('/check-auth');
};

// 사용자 정보 조회
export const getUserInfo = async () => {
  return apiRequest('/user-info');
};

export default {
  login,
  logout,
  signup,
  checkDuplicate,
  checkAuthStatus,
  getUserInfo
};