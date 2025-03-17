import { createBrowserRouter } from 'react-router-dom';
import RootLayout from "../components/layout/RootLayout.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Home from "../pages/Home.jsx"
import Auctions from '../pages/Auctions.jsx';
import RegistProduct from '../pages/registProduct.jsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            // 중첩된 라우트를 추가하여 Outlet에 렌더링될 페이지들 설정
            {
                index: true,  // / 경로에 대해 기본 페이지 (Home 컴포넌트)
                element: <Home />
            },
            {
                path: '/ongoing-auctions',
                element: <Auctions/>
            }
          ,
          {
            path: '/register-product',
            element: <RegistProduct/>
          }
           
        ],
    }
])

export default router;