import React, { createContext, useState, useEffect } from 'react';

// 기본값 설정
export const AuthContext = createContext({
  isAuthenticated: false,
  userInfo: null,
  setIsAuthenticated: () => {},
  setUserInfo: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  // 초기 상태를 localStorage에서 가져오도록 설정
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('accessToken') ? true : false;
  });
  
  const [userInfo, setUserInfo] = useState(() => {
    const username = localStorage.getItem('username');
    return username ? { username } : null;
  });

  // 로그인 상태 변경 시 localStorage 업데이트
  useEffect(() => {
    console.log('인증 상태 변경:', isAuthenticated, userInfo);
    
    // userInfo가 변경되면 localStorage 업데이트
    if (userInfo && userInfo.username) {
      localStorage.setItem('username', userInfo.username);
    }
  }, [isAuthenticated, userInfo]);

  // 로그아웃 함수
  const logout = async () => {
    try {
      await fetch('http://localhost:8088/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('로그아웃 API 호출 오류:', error);
    } finally {
      // 로컬 상태 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  };

  const authContextValue = {
    isAuthenticated,
    userInfo,
    setIsAuthenticated,
    setUserInfo,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};