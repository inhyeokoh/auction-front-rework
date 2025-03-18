import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * 인증된 사용자만 접근할 수 있는 보호된 라우트 컴포넌트
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // 인증 상태 확인 중일 때 로딩 표시
  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute;