import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/LoginForm.module.css';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 새로운 AuthContext의 setAuth 함수 사용
  const { setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData({ ...loginData, [id]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8088/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('로그인 응답 데이터:', data);
        
        // 새로운 방식: setAuth 함수로 토큰과 사용자명 전달
        setAuth(data.accessToken, data.username);
        
        // 로컬스토리지에 토큰 저장 (백업)
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('username', data.username);
        
        alert('로그인 성공!');
        navigate('/');
      } else {
        if (response.status === 401) {
          setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        } else {
          setError(data.message || '로그인 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('로그인 중 오류:', error);
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>로그인</h2>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>아이디 또는 이메일</label>
            <input
              id="username"
              type="text"
              value={loginData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="아이디 또는 이메일 입력"
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="비밀번호 입력"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
          <div className={styles.signupContainer}>
            <span className={styles.signupText}>아이디가 없으신가요?</span>
            <Link to="/signup" className={styles.signupLink}>
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;