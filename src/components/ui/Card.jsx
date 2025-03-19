import React from "react";
import styles from "./Card.module.css";

// 기본 카드 컴포넌트
function Card({ children, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
}

// 카드 제목 컴포넌트
function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`${styles.title} ${className}`}>
      {children}
    </h3>
  );
}

// 카드 내용 컴포넌트
function CardContent({ children, className = "" }) {
  return (
    <div className={`${styles.content} ${className}`}>
      {children}
    </div>
  );
}

// 카드 푸터 컴포넌트
function CardFooter({ children, className = "" }) {
  return (
    <div className={`${styles.footer} ${className}`}>
      {children}
    </div>
  );
}

export { Card, CardTitle, CardContent, CardFooter };