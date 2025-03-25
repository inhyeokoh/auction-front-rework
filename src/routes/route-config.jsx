import { createBrowserRouter } from 'react-router-dom';
import RootLayout from "../components/layout/RootLayout.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Home from "../pages/Home.jsx";
import NotificationTest from "../pages/NotificationTest.jsx";
import Auctions from '../pages/Auctions.jsx';
import RegistProduct from '../pages/RegisterProduct.jsx';
import LiveAuction from "../pages/LiveAuction.jsx";
import LoginForm from '../pages/auth/LoginForm.jsx';
import SignupForm from '../pages/auth/SignupForm.jsx';
import AuctionDetail from '../pages/AuctionDetail.jsx';
import MyPage from '../pages/Mypage.jsx';
import ReservedAuctions from '../pages/ReservedAuctions.jsx';
import EndedAuctions from '../pages/EndedAuctions.jsx';




const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            // 중첩된 라우트를 추가하여 Outlet에 렌더링될 페이지들 설정
            {
                index: true,
                element: <Home />
            },
            {
                path: '/ongoing-auctions',
                element: <Auctions/>
            },
            {
                path: '/register-product',
                element: <RegistProduct/>
            },
            {
                path: '/notifications',
                element: <NotificationTest />,
            },
            {
                path: '/live-auction/:getProductIdToURL', // 상품 아이디를 url에서 받아옴 
                element: <LiveAuction />,                
                loader: async ({ params }) => {
                    const productId = params.getProductIdToURL;  // URL 파라미터 값 가져오기
                    const token = localStorage.getItem('accessToken'); // 로컬 저장소에서 토큰 가져오기
                    console.log(`라우트 토큰 : ${token}`);
                    
                    const res = await fetch(`http://localhost:8088/api/auction/${productId}`, {
                        method: 'GET',
                        headers: {
                          'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                        },
                      });  // API 요청 시 파라미터 활용
                    const jsonData = await res.json();                  
                    return jsonData;  // 컴포넌트에 전달
                }
            },
            {
                path: '/login',
                element: <LoginForm/>
            },
            {
                path: '/signup',
                element: <SignupForm/>
            }
            ,
            {
                path: '/ongoing-auction/:productId',
                element: <AuctionDetail/>
            }
            ,
            {
                path: '/mypage',
                element: <MyPage/>
            },
            {
                path: '/reserved-auctions',
                element: <ReservedAuctions/>
            },
            {
                path: '/ended-auctions',
                element:<EndedAuctions/>
            }
        ],
    }
])

export default router;