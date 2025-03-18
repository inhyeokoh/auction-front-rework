import React, { createContext, useState, useEffect } from 'react';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

// 인증 상태 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 서버에 인증 상태 확인 API 호출
        const response = await fetch('http://localhost:8088/api/auth/check-auth', {
          method: 'GET',
          credentials: 'include' // 쿠키 포함
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserInfo({
            username: data.username
          });
        } else {
          // 인증되지 않은 상태로 초기화
          setIsAuthenticated(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        setIsAuthenticated(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8088/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // 쿠키 포함
      });

      if (response.ok) {
        // 상태 초기화
        setIsAuthenticated(false);
        setUserInfo(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      return false;
    }
  };

  // 제공할 컨텍스트 값
  const authContextValue = {
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    isLoading,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};