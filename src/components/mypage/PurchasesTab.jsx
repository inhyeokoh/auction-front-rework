import React, { useState, useEffect } from "react";
import styles from "../../styles/MyPage.module.css";
import

const PurchasesTab = () => {
  const [purchases, setPurchases] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchPurchases();
  }, [sortBy]);

  const fetchPurchases = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
          `${API_BASE_URL}/api/tradeRecord/purchases?sortBy=${sortBy}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (!response.ok) {
        alert("구매 내역 조회 실패");
        return;
      }

      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      alert("구매 내역 조회 실패:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>내 구매 상품</h2>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="priceHigh">높은 가격순</option>
          <option value="priceLow">낮은 가격순</option>
        </select>
        {purchases.length > 0 ? (
            <table>
              <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>판매자</th>
                <th>거래 시간</th>
              </tr>
              </thead>
              <tbody>
              {purchases.map((purchase) => (
                  <tr key={purchase.tradeId}>
                    <td>{purchase.itemName}</td>
                    <td>{purchase.amount}</td>
                    <td>{purchase.opponentName}</td>
                    <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <div className={styles.emptyState}>구매한 상품이 없습니다.</div>
        )}
      </div>
  );
};

export default PurchasesTab;
