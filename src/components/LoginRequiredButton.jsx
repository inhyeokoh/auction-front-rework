import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * 로그인이 필요한 기능을 위한 버튼 컴포넌트
 * 로그인 상태에 따라 지정된 경로로 이동하거나 로그인 페이지로 리디렉션
 */
const LoginRequiredButton = ({ 
  children, 
  to = '/register-product', 
  className, 
  onClick,
  ...props 
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    // 사용자 정의 onClick 핸들러가 있으면 실행
    if (onClick) {
      onClick(e);
    }

    if (isAuthenticated) {
      // 로그인된 경우 지정된 경로로 이동
      navigate(to);
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      alert('상품 등록을 위해서는 로그인이 필요합니다.');
      navigate('/login');
    }
  };

  return (
    <button 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default LoginRequiredButton;