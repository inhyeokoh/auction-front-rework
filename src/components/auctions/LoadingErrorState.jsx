import React from "react";

const LoadingErrorState = ({ loading, error, retryFn }) => {
  if (loading) {
    return <div className="loading-message">상품 목록을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={retryFn} className="retry-button">다시 시도</button>
      </div>
    );
  }

  return null;
};

export default LoadingErrorState;