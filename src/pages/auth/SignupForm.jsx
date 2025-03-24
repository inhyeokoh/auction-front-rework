import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/SignupForm.module.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phone: '',
    password: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // 폼 데이터 업데이트
    const newFormData = { ...formData, [id]: value };
    setFormData(newFormData);
    
    // 실시간 유효성 검사 수행
    const fieldErrors = validateField(id, value, newFormData);
    
    // 에러 상태 업데이트
    if (fieldErrors) {
      setErrors({ ...errors, [id]: fieldErrors });
    } else if (errors[id]) {
      // 에러 없으면 지우기
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
    
    // 입력값이 변경되면 중복검사 상태 초기화 (username, email, phone)
    if (id === 'username' || id === 'email' || id === 'phone') {
      setValidations({ ...validations, [id]: '' });
      
      // 값 입력 후 일정 시간 후에 자동으로 중복 체크 수행
      if (value.length > 0 && !fieldErrors) {
        const debounceTimeout = setTimeout(() => {
          checkDuplicate(id, value);
        }, 500); // 0.5초 후에 중복 체크 실행
        
        return () => clearTimeout(debounceTimeout);
      }

      
    }
  };
  
  // 개별 필드 유효성 검사 함수
  const validateField = (fieldName, value, formData = formData) => {
    switch(fieldName) {
      case 'username':
        if (!value) {
            return '아이디를 입력해주세요.';
        } else if (value.length < 4 || value.length > 20) {
            return '아이디는 영문 숫자 4자 이상 20자 이하로 작성해야 합니다.';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            return '아이디는 영문과 숫자로만 구성되어야 합니다.';
        }
        return null;
    
        
      case 'name':
        if (!value) {
          return '이름을 입력해주세요.';
        }
        return null;
        
      case 'password':
        if (!value) {
          return '비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          return '비밀번호는 8자 이상이어야 합니다.';
        }
        return null;
        
      case 'email':
        if (!value) {
          return '이메일을 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          return '유효한 이메일 형식이 아닙니다.';
        }
        return null;
        
      case 'phone':
        if (!value) {
          return '전화번호를 입력해주세요.';
        } else if (!/^01[016789][0-9]{3,4}[0-9]{4}$/.test(value)) {
          return '유효한 전화번호 형식이 아닙니다.';
        }
        return null;
        
      default:
        return null;
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

    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01[016789][0-9]{3,4}[0-9]{4}$/.test(formData.phone)) {
      newErrors.phone = '유효한 전화번호 형식이 아닙니다.';
    }
    
    return newErrors;
  };

  // 사용자가 값을 수정할 때마다 전체 폼 유효성 확인
  useEffect(() => {
    // 실시간으로 모든 필드의 유효성 검사 (폼에 값이 있을 때만)
    if (Object.values(formData).some(value => value)) {
      validateForm();
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // 중복 검사 결과 확인
    if (validations.username !== '사용 가능한 아이디입니다.' || 
        validations.email !== '사용 가능한 이메일입니다.' ||
        validations.phone !== '사용 가능한 전화번호입니다.') {
      setErrors({ general: '아이디, 이메일 및 전화번호 중복 확인이 필요합니다.' });
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
          email: formData.email,
          phone: formData.phone
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
          setErrors({ general: '이미 사용 중인 아이디, 이메일 또는 전화번호입니다.' });
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

  // 아이디/이메일/전화번호 중복 체크
  const checkDuplicate = async (type, value) => {
    if (!value) return;
  
    try {
      const response = await fetch(`http://localhost:8088/api/auth/check-duplicate?type=${type}&value=${value}`);
      const data = await response.json();
  
      if (!data.available) {
        setErrors({ ...errors, [type]: data.message });
        setValidations({ ...validations, [type]: data.message });
      } else {
        // 사용 가능한 경우 검증 메시지 설정
        let successMessage = '';
        if (type === 'username') successMessage = '사용 가능한 아이디입니다.';
        else if (type === 'email') successMessage = '사용 가능한 이메일입니다.';
        else if (type === 'phone') successMessage = '사용 가능한 전화번호입니다.';
        
        setValidations({
          ...validations,
          [type]: successMessage
        });
  
        // 기존 에러 삭제
        const newErrors = { ...errors };
        delete newErrors[type];
  
        // 일반 에러 메시지도 초기화
        if (errors.general) {
          delete newErrors.general;
        }
  
        setErrors(newErrors);
      }
    } catch (error) {
      console.error(`${type} 중복 체크 중 오류:`, error);
      setValidations({
        ...validations,
        [type]: '중복 확인 중 오류가 발생했습니다.'
      });
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
                className={styles.input}
                required
              />
            </div>
            {errors.username ? (
              <p className={styles.errorMessage}>{errors.username}</p>
            ) : validations.username && (
              <p className={validations.username.includes('사용 가능') ? styles.successMessage : styles.errorMessage}>
                {validations.username}
              </p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>닉네임</label>
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
            <label htmlFor="phone" className={styles.label}>전화번호</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="01012345678"
              required
            />
            {errors.phone ? (
              <p className={styles.errorMessage}>{errors.phone}</p>
            ) : validations.phone && (
              <p className={validations.phone.includes('사용 가능') ? styles.successMessage : styles.errorMessage}>
                {validations.phone}
              </p>
            )}
          </div>
            
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <div className={styles.inputWithButton}>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            {errors.email ? (
              <p className={styles.errorMessage}>{errors.email}</p>
            ) : validations.email && (
              <p className={validations.email.includes('사용 가능') ? styles.successMessage : styles.errorMessage}>
                {validations.email}
              </p>
            )}
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