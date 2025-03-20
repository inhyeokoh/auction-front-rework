import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, UserCog, Bell } from "lucide-react";
import styles from "../styles/MyPage.module.css";
import SalesTab from "../components/mypage/SalesTab";
import PurchasesTab from "../components/mypage/PurchasesTab";
import ProfileTab from "../components/mypage/ProfileTab";
import NotificationsTab from "../components/mypage/NotificationsTab";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>마이페이지</h1>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          <button 
            className={`${styles.tabButton} ${activeTab === "sales" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            <ShoppingBag className={styles.icon} /> 판매내역
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "purchases" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("purchases")}
          >
            <ShoppingCart className={styles.icon} /> 구매내역
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "notifications" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className={styles.icon} /> 내소식
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserCog className={styles.icon} /> 정보수정
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "sales" && <SalesTab />}
          {activeTab === "purchases" && <PurchasesTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;