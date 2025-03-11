import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

const RootLayout = () => {
    return (
        <>
         <Header />
         <Outlet />
         <Footer />
        </>
    );
};

export default RootLayout;