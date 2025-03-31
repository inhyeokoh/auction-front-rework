import React, { useState } from 'react';
import styles from '../styles/Guide.module.css';
import register from '../components/img/register.png'
import login from '../components/img/login.png'
import registProduct from '../components/img/registProduct.png'
import seller from '../components/img/seller.png'
import reserve from '../components/img/reserve.png'
import stream from '../components/img/stream.png'
const Guide = () => {
  const [activeTab, setActiveTab] = useState('seller');

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>땅땅마켓 이용 가이드</h1>
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'seller' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('seller')}
        >
          경매자(판매자) 가이드
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'bidder' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('bidder')}
        >
          입찰자(구매자) 가이드
        </button>
      </div>
      
      {activeTab === 'seller' ? (
        <div className={styles.guideContent}>
          <h2 className={styles.sectionTitle}>경매자(판매자) 이용 가이드</h2>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 1: 회원가입 및 로그인</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>땅땅마켓을 이용하기 위해 먼저 회원가입을 진행해주세요. 회원가입 후 로그인을 하시면 상품을 등록할 수 있습니다.</p>
                <ul>
                  <li>우측 상단의 '회원가입' 버튼을 클릭합니다.</li>
                  <li>필요한 정보를 입력하고 회원가입을 완료합니다.</li>
                  <li>'로그인' 버튼을 클릭하여 로그인합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                <img src={register} alt="회원가입" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 2: 상품 등록하기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>판매하고자 하는 상품을 등록합니다. 상세한 정보와 이미지를 첨부하면 구매자의 관심을 더 많이 얻을 수 있습니다.</p>
                <ul>
                  <li>메인 화면 또는 상단 네비게이션에서 '상품 등록' 버튼을 클릭합니다.</li>
                  <li>상품 이름, 설명, 카테고리, 시작가, 경매 단위, 즉시 구매가를 설정합니다.</li>
                  <li>상품 이미지를 업로드합니다(최소 1장 이상).</li>
                  <li>'상품 등록하기' 버튼을 클릭하여 등록을 완료합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                <img src={registProduct} alt="" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 3: 경매 시작하기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>등록한 상품의 경매를 시작하여 실시간으로 입찰을 받을 수 있습니다.</p>
                <ul>
                  <li>'경매 리스트'에서 본인이 등록한 상품을 확인합니다.</li>
                  <li>상품 상세 페이지에서 '경매 시작' 버튼을 클릭합니다.</li>
                  <li>경매가 시작되면 실시간 라이브 경매 페이지로 이동합니다.</li>
                  <li>카메라와 마이크 접근을 허용하여 라이브 경매를 진행합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                <img src={seller} alt="경매시작" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 4: 실시간 경매 진행하기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>실시간 비디오와 채팅을 통해 입찰자들과 소통하며 경매를 진행합니다.</p>
                <ul>
                  <li>상단의 비디오/오디오 아이콘을 통해 카메라와 마이크를 제어할 수 있습니다.</li>
                  <li>실시간 채팅을 통해 입찰자들의 질문에 답변할 수 있습니다.</li>
                  <li>현재 입찰가와 입찰자 정보를 실시간으로 확인할 수 있습니다.</li>
                  <li>즉시 구매가에 도달하거나 경매를 종료하고 싶을 때 '경매 종료' 버튼을 클릭합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                <img src={stream} alt="" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 5: 거래 완료</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>경매가 종료되면 최고 입찰자와의 거래가 성사됩니다.</p>
                <ul>
                  <li>경매 종료 후 최고 입찰자의 정보와 안심번호가 알림으로 제공됩니다.</li>
                  <li>마이페이지의 '판매내역'에서 거래 상태를 확인할 수 있습니다.</li>
                  <li>안심번호를 통해 구매자와 연락하여 배송 및 거래 세부사항을 조율합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                {/* 거래 완료 화면 스크린샷 자리 */}
              </div>
            </div>
          </div>
          
          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>경매자 팁</h3>
            <ul className={styles.tipsList}>
              <li>상품 상세 정보와 다양한 각도의 사진을 제공하여 구매자의 신뢰를 얻으세요.</li>
              <li>적정한 시작가와 즉시 구매가를 설정하여 많은 입찰을 유도하세요.</li>
              <li>경매 시작 전에 예약자 수를 확인하여 최적의 시간에 경매를 시작하세요.</li>
              <li>라이브 경매 중에는 상품에 대한 추가 설명과 실시간 시연을 보여주세요.</li>
              <li>입찰자의 질문에 신속하고 정확하게 응답하여 원활한 경매를 진행하세요.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className={styles.guideContent}>
          <h2 className={styles.sectionTitle}>입찰자(구매자) 이용 가이드</h2>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 1: 회원가입 및 로그인</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>땅땅마켓을 이용하기 위해 먼저 회원가입을 진행해주세요. 회원가입 후 로그인을 하시면 경매에 참여할 수 있습니다.</p>
                <ul>
                  <li>우측 상단의 '회원가입' 버튼을 클릭합니다.</li>
                  <li>필요한 정보를 입력하고 회원가입을 완료합니다.</li>
                  <li>'로그인' 버튼을 클릭하여 로그인합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
              <img src={register} alt="회원가입" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 2: 경매 상품 찾기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>관심 있는 상품을 찾아보세요. 다양한 카테고리와 검색 기능을 활용하여 원하는 상품을 찾을 수 있습니다.</p>
                <ul>
                  <li>'경매 리스트'에서 현재 등록된 상품을 확인할 수 있습니다.</li>
                  <li>상단 검색창에서 키워드로 상품을 검색할 수 있습니다.</li>
                  <li>인기 경매 상품 TOP 5를 통해 인기 있는 상품을 확인할 수 있습니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                {/* 경매 상품 검색 화면 스크린샷 자리 */}
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 3: 경매 예약하기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>관심 있는 상품의 경매에 참여하기 위해 예약을 진행합니다.</p>
                <ul>
                  <li>상품 상세 페이지에서 상품 정보를 확인합니다.</li>
                  <li>'경매 예약' 버튼을 클릭하여 참여 의사를 표시합니다.</li>
                  <li>예약 완료 후 '예약된 경매' 메뉴에서 예약 상태를 확인할 수 있습니다.</li>
                  <li>경매 시작 시간에 맞추어 알림을 받아 참여할 수 있습니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
              <img src={reserve} alt="회원가입" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 4: 실시간 경매 참여하기</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>판매자가 경매를 시작하면 실시간으로 입찰에 참여할 수 있습니다.</p>
                <ul>
                  <li>경매가 시작되면 '경매 입장' 버튼을 클릭하여 라이브 경매 페이지로 이동합니다.</li>
                  <li>현재 입찰가와 다른 입찰자들의 입찰 상황을 실시간으로 확인할 수 있습니다.</li>
                  <li>+/- 버튼을 사용하여 입찰 금액을 조정하고 '입찰하기' 버튼을 클릭하여 입찰합니다.</li>
                  <li>채팅 기능을 통해 판매자에게 질문을 할 수 있습니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
              <img src={stream} alt="회원가입" />
              </div>
            </div>
          </div>
          
          <div className={styles.guideSection}>
            <h3 className={styles.stepTitle}>STEP 5: 낙찰 및 거래 완료</h3>
            <div className={styles.stepContent}>
              <div className={styles.textContent}>
                <p>최고 입찰자로 선정되면 낙찰되어 거래가 성사됩니다.</p>
                <ul>
                  <li>경매가 종료되면 최고 입찰자에게 낙찰 알림이 전송됩니다.</li>
                  <li>판매자와의 안전한 연락을 위한 안심번호가 제공됩니다.</li>
                  <li>마이페이지의 '구매내역'에서 거래 상태를 확인할 수 있습니다.</li>
                  <li>안심번호를 통해 판매자와 연락하여 배송 및 결제 등의 세부사항을 협의합니다.</li>
                </ul>
              </div>
              <div className={styles.imageContainer}>
                {/* 낙찰 화면 스크린샷 자리 */}
              </div>
            </div>
          </div>
          
          <div className={styles.tipsSection}>
            <h3 className={styles.tipsTitle}>입찰자 팁</h3>
            <ul className={styles.tipsList}>
              <li>경매 예약자 수가 많은 상품은 인기가 많으니 미리 준비하세요.</li>
              <li>상품 설명과 이미지를 꼼꼼히 확인하고, 불명확한 부분은 채팅으로 질문하세요.</li>
              <li>경매 시작 전에 최대 입찰 금액을 미리 정해두면 충동적인 입찰을 방지할 수 있습니다.</li>
              <li>즉시 구매 금액과 현재 입찰가를 비교하여 합리적인 입찰 전략을 세우세요.</li>
              <li>라이브 경매 시간에 맞춰 미리 접속하여 준비하면 좋습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guide;