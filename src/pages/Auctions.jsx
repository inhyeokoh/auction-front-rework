import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auctions.css";
// 컴포넌트 import
import AuctionsHeader from "../components/auctions/AuctionsHeader";
import LoadingErrorState from "../components/auctions/LoadingErrorState";
import ProductGrid from "../components/auctions/ProductGrid";

// 유틸리티 함수 import
import { fetchProducts, getProductImage } from "../components/auctions/ProductUtis";

const Auctions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // 상품 목록을 가져오는 함수
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await fetchProducts();
      console.log("API 응답 데이터:", { products }); // 디버깅용 로그
      setProducts(products);
    } catch (error) {
      console.error("상품 목록 조회 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 상품 목록을 가져옵니다
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <div className="auctions-container">
        <AuctionsHeader isAuthenticated={isAuthenticated} />
        
        <LoadingErrorState 
          loading={loading} 
          error={error} 
          retryFn={loadProducts} 
        />
        
        {!loading && !error && (
          <ProductGrid 
            products={products} 
            getProductImage={getProductImage} 
          />
        )}
      </div>
    </div>
  );
};

export default Auctions;