import { createBrowserRouter } from 'react-router-dom';
import RootLayout from "../components/layout/RootLayout.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import Home from "../pages/Home.jsx";
import NotificationTest from "../pages/NotificationTest.jsx";
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
                index: true,
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
           ,
            {
                path: '/notifications',
                element: <NotificationTest />,
            },
        ],
    }
])

export default router;