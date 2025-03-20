import React, { useState } from "react";
import styles from "../styles/MyPage.module.css";

const ProfileTab = () => {
  const [formData, setFormData] = useState({
    username: "사용자123",
    email: "user@example.com",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 정보 수정 로직을 추가할 수 있습니다
    console.log("제출된 정보:", formData);
    alert("프로필이 업데이트되었습니다");
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>회원정보 수정</h2>
      <form className={styles.profileForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="username">
            사용자 이름
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            readOnly
            className={`${styles.formInput} ${styles.readOnly}`}
          />
          <p className={styles.formHelper}>사용자 이름은 변경할 수 없습니다.</p>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">
            새 비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="변경할 비밀번호 입력"
            className={styles.formInput}
          />
          <p className={styles.formHelper}>비밀번호를 변경하려면 새 비밀번호를 입력하세요.</p>
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            정보 수정하기
          </button>
        </div>
      </form>
    </>
  );
};

export default ProfileTab;