import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignupForm.module.css';

const SignupForm = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const newUser = {
      userId,
      nickname,
      password,
      email
    };

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some((user) => user.userId === userId)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }

    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    
    alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
    navigate('/login');
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>회원가입</h2>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.label}>아이디</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nickname" className={styles.label}>닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.button}>회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;