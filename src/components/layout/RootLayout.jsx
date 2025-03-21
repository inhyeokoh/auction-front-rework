import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

const RootLayout = () => {
    return (
        <>
            <Header/>
            <div className="outlet-container">
                <Outlet/>
            </div>
            <Footer/>
        </>
    );
};

export default RootLayout;