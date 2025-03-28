import React, { useState, useEffect } from "react";
import styles from "../../styles/MyPage.module.css";
import { API_BASE_URL } from "../../config/host-config.js";

const SalesTab = ( ) => {
  const [sales, setSales] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchSales();
  }, [sortBy]);

  const fetchSales = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(
          `${API_BASE_URL}/api/tradeRecord/sales?sortBy=${sortBy}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
      );
      console.log("판매 response", response);

      if (!response.ok) {
        alert('판매 내역 조회 실패');
      }

      const data = await response.json();
      console.log("판매 내역 데이터", data);
      setSales(data);
    } catch (error) {
      alert('판매 내역 조회 실패:', error);
    }
  };


  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>내 판매 상품</h2>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="priceHigh">높은 가격순</option>
          <option value="priceLow">낮은 가격순</option>
        </select>
        {sales.length > 0 ? (
            <table>
              <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>구매자</th>
                <th>거래 시간</th>
              </tr>
              </thead>
              <tbody>
              {sales.map(sale => (
                  <tr key={sale.tradeId}>
                    <td>{sale.itemName}</td>
                    <td>{sale.amount}</td>
                    <td>{sale.opponentName}</td>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <div className={styles.emptyState}>
              등록한 판매 상품이 없습니다.
            </div>
        )}
      </div>
  );
};

export default SalesTab;