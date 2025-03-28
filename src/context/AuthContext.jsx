import React, { createContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from "../config/host-config.js";

// 기본값 설정
export const AuthContext = createContext({
  isAuthenticated: false,
  userInfo: null,
  setAuth: () => {},
  logout: () => {},
  isLoading: true
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userInfo: null,
    isLoading: true
  });

  // 토큰 리프레시 함수
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include' // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      
      setAuthState({
        isAuthenticated: true,
        userInfo: { 
          username: data.username, 
          name: data.name, 
          memberId: data.memberId,
          accessToken: data.accessToken
        },
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      logout();
      return false;
    }
  }, []);

  // 초기화 함수
  const initAuth = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const memberId = localStorage.getItem('memberId');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log('인증 초기화:', { token: !!token, username, name, memberId, refreshToken: !!refreshToken });
    
    if (token && username) {
      setAuthState({
        isAuthenticated: true,
        userInfo: { username, name, memberId: Number(memberId), accessToken: token },
        isLoading: false
      });
      
      // 토큰 만료 시간을 체크하고 타이머 설정
      const setupTokenRefresh = () => {
        // 토큰 만료 10분 전에 갱신 (액세스 토큰 유효 시간이 60분이므로 50분 후에 갱신)
        const REFRESH_TIME = 45 * 1000; // 50분
        return setTimeout(() => {
          refreshToken();
        }, REFRESH_TIME);
      };
      
      const refreshTimerId = setupTokenRefresh();
      return () => clearTimeout(refreshTimerId);
    } else if (refreshToken) {
      // 액세스 토큰은 없지만 리프레시 토큰이 있는 경우 갱신 시도
      refreshToken();
    } else {
      // 토큰이 없으면 인증되지 않은 상태
      setAuthState({
        isAuthenticated: false,
        userInfo: null,
        isLoading: false
      });
    }
  }, [refreshToken]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log('AuthProvider 마운트됨');
    const cleanup = initAuth();
    
    // 스토리지 변경 이벤트 리스너 (다른 탭에서 로그아웃했을 때 동기화)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'username' || e.key === 'memberId' || e.key === 'refreshToken') {
        console.log('스토리지 변경 감지:', e.key);
        initAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('storage', handleStorageChange);
      console.log('AuthProvider 언마운트됨');
    };
  }, [initAuth]);

  // 인증 상태 설정 함수 (로그인 시 사용)
  const setAuth = useCallback((token, username, name, memberId, refreshToken) => {
    console.log('인증 설정:', { token: !!token, username, name, memberId, refreshToken: !!refreshToken });


    if (token && username) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('name', name);
      localStorage.setItem('memberId', memberId);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      setAuthState({
        isAuthenticated: true,
        userInfo: { username, name, memberId, accessToken: token },
        isLoading: false
      });
    }
  }, []);

  // 로그아웃 함수
  const logout = useCallback(async () => {
    console.log('로그아웃 요청');
    
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
    } finally {
      // 상태 및 스토리지 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('memberId');
      localStorage.removeItem('refreshToken');
      
      setAuthState({
        isAuthenticated: false,
        userInfo: null,
        isLoading: false
      });
    }
  }, []);

  // 컨텍스트 값
  const contextValue = {
    isAuthenticated: authState.isAuthenticated,
    userInfo: authState.userInfo,
    isLoading: authState.isLoading,
    setAuth,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};