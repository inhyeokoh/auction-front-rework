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

  // 초기화 함수
  const initAuth = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const memberId = localStorage.getItem('memberId');
    
    console.log('인증 초기화:', { token: !!token, username, name, memberId });
    
    if (token && username) {
      setAuthState({
        isAuthenticated: true,
        userInfo: { username, name, memberId: Number(memberId), accessToken: token },
        isLoading: false
      });
    } else {
      // 토큰이 없으면 인증되지 않은 상태
      setAuthState({
        isAuthenticated: false,
        userInfo: null,
        isLoading: false
      });
    }
  }, []);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log('AuthProvider 마운트됨');
    initAuth();
    
    // 스토리지 변경 이벤트 리스너 (다른 탭에서 로그아웃했을 때 동기화)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'username' || e.key === 'memberId') {
        console.log('스토리지 변경 감지:', e.key);
        initAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      console.log('AuthProvider 언마운트됨');
    };
  }, [initAuth]);

  // 인증 상태 설정 함수 (로그인 시 사용)
  const setAuth = useCallback((token, username, name, memberId) => {
    console.log('인증 설정:', { token: !!token, username, name, memberId });

    if (token && username) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('name', name);
      localStorage.setItem('memberId', memberId);
      
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
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};