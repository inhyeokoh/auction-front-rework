import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignupForm.module.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 유효성 검사
    if (!formData.username) newErrors.username = '아이디를 입력해주세요.';
    if (!formData.name) newErrors.name = '이름을 입력해주세요.';
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 백엔드 API 호출 (fetch 사용)
      const response = await fetch('http://localhost:8088/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          password: formData.password,
          email: formData.email
        })
      });
      
      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        // 서버에서 반환한 에러 메시지 처리
        if (response.status === 400) {
          if (data.message) {
            setErrors({ general: data.message });
          } else if (data.errors) {
            // 필드별 유효성 검사 에러
            const serverErrors = {};
            data.errors.forEach(err => {
              serverErrors[err.field] = err.defaultMessage;
            });
            setErrors(serverErrors);
          }
        } else if (response.status === 409) {
          // 중복 아이디 또는 이메일
          setErrors({ general: '이미 사용 중인 아이디 또는 이메일입니다.' });
        } else {
          setErrors({ general: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
        }
      }
    } catch (error) {
      console.error('회원가입 중 오류:', error);
      setErrors({ general: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 아이디 중복 체크
  const checkDuplicate = async (type, value) => {
    if (!value) return;
    
    try {
      const response = await fetch(`http://localhost:8088/api/auth/check-duplicate?type=${type}&value=${value}`);
      const data = await response.json();
      
      if (!data.available) {
        setErrors({ ...errors, [type === 'username' ? 'username' : 'email']: data.message });
      }
    } catch (error) {
      console.error(`${type} 중복 체크 중 오류:`, error);
    }
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>회원가입</h2>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>아이디</label>
            <div className={styles.inputWithButton}>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => checkDuplicate('username', formData.username)}
                className={styles.input}
                required
              />
              <button 
                type="button" 
                className={styles.checkButton}
                onClick={() => checkDuplicate('username', formData.username)}
              >
                중복확인
              </button>
            </div>
            {errors.username && <p className={styles.errorMessage}>{errors.username}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>이름</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <div className={styles.inputWithButton}>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => checkDuplicate('email', formData.email)}
                className={styles.input}
                required
              />
              <button 
                type="button" 
                className={styles.checkButton}
                onClick={() => checkDuplicate('email', formData.email)}
              >
                중복확인
              </button>
            </div>
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          </div>
          
          {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
          
          <button 
            type="submit" 
            className={styles.button} 
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;