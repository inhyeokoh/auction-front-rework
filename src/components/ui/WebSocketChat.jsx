import React, { useEffect, useState, useRef , useContext } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useParams} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/host-config';

//방만들기 버튼 클릭시 상품id url로 전송 -> useParams로 받아서 사용 
const WebSocketChat = () => {   

  const { getProductIdToURL } = useParams(); // URL에서 productId 파라미터를 가져옴 -> 상품 id로 해당 경매 생성 + 상품 id로 경매 조회
  const { userInfo } = useContext(AuthContext); //토큰에서 현재 로그인한 유저정보 가져오기

  // 채팅 상태 변수
  const [message, setMessage] = useState(''); //클라이언트가 보낼 채팅내역
  const [chatMessages, setChatMessages] = useState([]); //서버가 응답한 채팅내역
  // 경매 상태 변수
  const [auctionData, setAuctionData] = useState({}); // 현재 경매 정보
  // 입찰 상태 변수 
  const [bidAmount, setBidAmount] = useState(''); // 입찰가 , 초기값은 경매시작가
  const [highestBid, setHighestBid] = useState(''); // 최고 입찰가 상태
  const [winnerUser, setWinnerUser] = useState(''); //최고 입찰자 username

  const stompClient = useRef({}); // stompClient를 useRef로 선언하여 참조 유지 // 각 경매방에 대한 stompClient 관리
  const connected = useRef({}); // 각 경매방에 대한 연결 상태 관리 , useState로 관리하니까 리렌더링에 영향을 받아서 유지가 잘 안되는 것 같음
 

  // 상품id로 해당 경매 조회 후 경매 데이터로 초기 세팅
  useEffect(() => {       

    console.log(`url에서 받아온 값${getProductIdToURL}`);    
     
    console.log(`로그인한 유저 정보 : ${userInfo}`); //url에서 받아온 상품 아이디로 조회
    

    //경매 정보 요청 - 방에 입장했을 때 초기 설정
    const fetchAuctionData = async () => {      
        //상품 id로 경매 정보 요청
        console.log(`상품 조회 token : ${userInfo.accessToken}`);
        const response = await fetch(`${API_BASE_URL}/api/auction/${getProductIdToURL}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userInfo.accessToken}`
          }
        });
        
        // 응답 상태가 200이 아닐 경우 예외 처리
        if (!response.ok) {
          throw new Error('경매 데이터를 불러오는 데 실패했습니다.');
        }

        //응답받은 경매 정보 접근하기
        const getAuctionData = await response.json();
        console.log(getAuctionData);  
        console.log(getAuctionData.auctionInfo);  
        const foundAuctionData = getAuctionData.auctionInfo; // auctionInfo안에 데이터 담겨있음
              
        setAuctionData(foundAuctionData);  // 경매 정보

        // 입찰자가 없을 시 최고가는 경매 시작가로 설정됨 + 새로고침시 사용자의 입찰금액도 현재 최고 입찰가로 설정됨
        if(foundAuctionData.currentPrice === null){
          //경매 초기세팅
          setHighestBid(foundAuctionData.product.startingPrice); 
          setBidAmount(foundAuctionData.product.startingPrice);   
          console.log("입찰자가 없어서 최고가는 경매 시작가로 설정됩니다.");               
        }else{
          //진행 중인 경매 세팅
          setHighestBid(foundAuctionData.currentPrice);  
          setBidAmount(foundAuctionData.currentPrice);  
          console.log(`현재 최고 입찰가는 ${foundAuctionData.currentPrice}입니다.`);     
        }   
        
        //채팅 초기 세팅
        //경매방 채팅내역 조회 요청
        console.log(`채팅내역 조회 token : ${userInfo.accessToken}`);
        
        const chatResponse = await fetch(`${API_BASE_URL}/api/chat/${foundAuctionData.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userInfo.accessToken}`
          }
        }); 

        // 응답 상태가 200이 아닐 경우 예외 처리
        if (!chatResponse.ok) {
          throw new Error('채팅 데이터를 불러오는 데 실패했습니다.');
        }
        
        //응답받은 채팅 내역 접근하기 
        const getChatData = await chatResponse.json();
        console.log(getChatData);
        console.log(getChatData.chat);
        const foundChatData = getChatData.chat;
        setChatMessages(foundChatData); // 채팅 데이터 초기 설정

        console.log(foundAuctionData);
      };
    fetchAuctionData(); //경매 정보 초기 세팅 후 웹소켓 서버 연결
  }, [getProductIdToURL]); // getProductIdToURL가 변경될 때마다 다시 실행
    
   
  // auctionData가 업데이트된 후 WebSocket 연결 설정
  useEffect(() => {

  // auctionData.id가 존재하고, 해당 경매방에 대해 아직 연결되지 않은 경우
  if (auctionData.id && !connected.current[auctionData.id]) {    
    // WebSocket 연결을 위한 SockJS와 Stomp 설정
    const socket = new SockJS(`${API_BASE_URL.replace('http://', 'wss://')}/ws-connect`);
    // 각 경매방에 대해 독립적인 웹소켓 클라이언트를 생성
    stompClient.current[auctionData.id] = Stomp.over(socket); 

    // 각 경매방에 WebSocket 서버에 연결
    stompClient.current[auctionData.id]?.connect({}, () => {
      connected.current[auctionData.id] = true;
      console.log('웹소켓 서버 연결');

      // 채팅 구독
      stompClient.current[auctionData.id]?.subscribe(`/topic/chat/${auctionData.id}`, (response) => {
        const getChatData = JSON.parse(response.body);
        setChatMessages((prevMessages) => [...prevMessages, getChatData]);
      });

      // 경매 구독
      stompClient.current[auctionData.id]?.subscribe(`/topic/bid/${auctionData.id}`, (response) => {
        const HighestBidData = JSON.parse(response.body);
        setHighestBid(HighestBidData.bidAmount);  // 최고 입찰금액
        setWinnerUser(HighestBidData.name); // 최고 입찰자              
      });
    });
    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (stompClient.current[auctionData.id]) {
        stompClient.current[auctionData.id]?.disconnect();
        connected.current[auctionData.id] = false; // 연결 상태 초기화
        console.log('서버 연결 종료');
      }
    };
  }  
}, [auctionData]); // auctionData가 변경될 때마다 다시 실행



  // 서버로 메시지 전송 함수
  const sendMessage = () => {
    if (connected.current[auctionData.id] && message.trim() !== '') {

    // 로컬 시간으로 변경 (타임존을 반영한 ISO 형식으로 변경)
    const date = new Date();

    // 서울 타임존을 반영한 날짜 포맷 (Date 객체를 'yyyy-MM-dd HH:mm:ss' 형식으로 변환)
    const options = {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,  // 24시간 형식
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    
    // '2025-03-27 12:21:46' 형태로 포맷
    const sentAt = formattedDate.replace(',', '').replace(/\//g, '-').replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1');
    console.log(sentAt);
    

      //현재 테스트용 임의 데이터
      const payload = {
        memberId: userInfo.memberId, //현재 로그인한 유저 id
        nickName : userInfo.name, //현재 로그인한 유저 닉네임
        auctionId: auctionData.id, //현재 상품경매방의 id
        message: message, //채팅메세지
        sentAt: sentAt, // 메시지 타임스탬프
      };

      // 연결되어있다면 웹소켓을 요청 주소를 통해 JSON데이터 전송  
      // 주소는 백엔드와 일치시켜야함
      if (stompClient.current[auctionData.id]) {
        stompClient.current[auctionData.id].send(`/auction/${payload.auctionId}/chat`, {}, JSON.stringify(payload));
      }
      setMessage(''); // 메시지 전송 후 입력창 비우기
    }
  };

  // 입찰가 증가 함수 (입찰 폭 -> 판매자가 설정한 단위)
  const handleBidIncrease = () => {
    setBidAmount((prevBid) => prevBid + auctionData.product.bidIncrease); // 예: 10000단위로 증가
  };

  // 입찰가 감소 함수 (입찰 폭 -> 판매자가 설정한 단위)
  const handleBidDecrease = () => {
    if (bidAmount > auctionData.currentPrice + auctionData.product.bidIncrease) {
      setBidAmount((prevBid) => prevBid - auctionData.product.bidIncrease);
    }
  };

  // 응찰 버튼 클릭 시 입찰 처리
const handleBidSubmit = async () => {    
  // 판매자 본인은 입찰할 수 없음
  if (userInfo.memberId === auctionData.product.memberId) {
    alert('판매자는 입찰에 참여하실 수 없습니다.');
    return; // 입찰 처리 중단
  }

  try {
    // 경매 상태 조회 (비동기 처리)
    const response = await fetch(`${API_BASE_URL}/api/auction/${getProductIdToURL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userInfo.accessToken}`,
      }
    });

    // 응답 상태가 200이 아닐 경우 예외 처리
    if (!response.ok) {
      throw new Error('경매 데이터를 불러오는 데 실패했습니다.');
    }

    const responseData = await response.json();
    const currentAuctionStatus = responseData.auctionInfo.status; // 경매 상태
    console.log(`현재 경매 상태: ${currentAuctionStatus}`);

    // 경매 상태가 'ONGOING'일 경우에만 입찰 진행
    if (currentAuctionStatus === 'ONGOING') {
      // 입찰가가 최고가보다 클 때, 서버로 JSON 데이터 전송
      if (bidAmount > highestBid) {
        const payload = {
          memberId: userInfo.memberId,         
          auctionId: auctionData.id, 
          bidAmount: bidAmount,
        };

        // 응찰 데이터 전송
        if (stompClient.current[auctionData.id]) {
          stompClient.current[auctionData.id].send(`/auction/${payload.auctionId}/bid`, {}, JSON.stringify(payload));
          setHighestBid(bidAmount); // 최고 입찰가 업데이트
          alert('최고가 입찰 성공!');

          // 입찰가가 즉시 낙찰가를 넘었을 경우
          if (bidAmount >= auctionData.product.buyNowPrice) {
            console.log('즉시입찰가보다 높은 금액입니다.');
            alert('즉시 낙찰');
          }
        }
      } else {
        alert('최고가보다 적은 입찰은 불가능합니다.');
      }
    } else {
      alert('경매가 진행중이 아닙니다. 입찰할 수 없습니다.');
    }
  } catch (error) {
    console.error('입찰 처리 중 오류 발생:', error);
    alert('입찰에 실패했습니다. 다시 시도해주세요.');
  }
};

  return (
    <div style={{
      maxWidth: '800px', margin: '0 auto', padding: '20px', borderRadius: '10px', backgroundColor: '#222', color: '#fff'
    }}>

      {/* 경매 정보 */}
      <div style={{
        marginBottom: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>
        <h2>{auctionData.product ? auctionData.product.name : '경매 정보 로딩 중...'}</h2>
        <p><strong>즉시 입찰가 :</strong> {auctionData.product ? auctionData.product.buyNowPrice : '정보 없음'} 원</p>
        <p><strong>시작가 :</strong> {auctionData.product ? auctionData.product.startingPrice : '정보 없음'} 원</p>
        <p><strong>현재 최고 입찰가 :</strong> {highestBid}원</p>
        <p><strong>최고 입찰자 :</strong> {winnerUser}</p>
      </div>

      {/* 입찰 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>입찰</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          {/* - 버튼 */}
          <button onClick={handleBidDecrease} style={{
            padding: '10px', backgroundColor: '#555', color: '#fff', border: '1px solid #666', borderRadius: '5px', marginRight: '10px'
          }}>-</button>
          {/* 입찰 */}
          <input type="number" value={bidAmount} onChange={(e) => setBidAmount(Number(e.target.value))} style={{
            padding: '10px', width: '120px', textAlign: 'center', borderRadius: '5px', border: '1px solid #444', marginRight: '10px'
          }}/>
          {/* + 버튼 */}
          <button onClick={handleBidIncrease} style={{
            padding: '10px', backgroundColor: '#555', color: '#fff', border: '1px solid #666', borderRadius: '5px'
          }}>+</button>
          {/* 입찰 버튼 */}
          <button onClick={handleBidSubmit} style={{
            padding: '10px 20px', marginLeft: '20px', backgroundColor: '#ff5500', color: '#fff', border: 'none', borderRadius: '5px'
          }}>입찰하기</button>
        </div>
        <p><strong>현재 입찰가 : {highestBid}원</strong></p>
      </div>

      {/* 채팅 영역 */}
      <div>
        <div style={{
          height: '300px', overflowY: 'scroll', marginBottom: '15px', padding: '10px', backgroundColor: '#333', border: '1px solid #444', borderRadius: '8px',
          display: 'flex', flexDirection: 'column-reverse', scrollbarWidth: 'thin', scrollbarColor: '#888 #1e1e1e', // 스크롤바 색상 (어두운 배경에 대비되는 회색 톤)
        }}>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {chatMessages.map((msg, index) => (
              <li key={index} style={{
                backgroundColor: '#444', padding: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex',
                alignItems: 'center', wordWrap: 'break-word', wordBreak: 'break-all', marginRight: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  {/* 닉네임 (본인 채팅 = 오렌지색 , 다른 유저 채팅 = 회색)*/} 
                  <strong style={{ color: msg.nickName === userInfo.name ? '#ff5500' : '#b0b0b0' }}>
                    {msg.nickName}
                  </strong>
                  {/* 채팅 내역 */}
                  <p style={{ fontSize: '14px', color: '#ccc' }}>{msg.message}</p>
                  {/* 입력 시간 */}
                  <span style={{ fontSize: '12px', color: '#aaa' }}>
                    {/* sentAt을 ISO 문자열로 받아서 로컬 시간으로 변환 */}
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : 'Invalid Time'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 채팅 입력창 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="채팅을 입력하세요"
            style={{
              padding: '10px', width: '65%', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#333', color: '#fff'
            }}
          />
          <button onClick={sendMessage} style={{
            padding: '10px 15px', marginLeft: '10px', backgroundColor: '#ff5500', color: 'white', border: 'none', borderRadius: '5px'
          }}>입력하기</button>
        </div>
      </div>

    </div>
  );
};

export default WebSocketChat;
