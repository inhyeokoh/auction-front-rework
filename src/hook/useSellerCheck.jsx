// /src/hooks/useSellerCheck.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useSellerCheck = (sellerId) => {
    const { userInfo } = useContext(AuthContext);

    // console.log("useSellerCheck");
    // console.log("로그인한 회원의 id :", userInfo);
    // console.log("로그인한 회원의 id :", userInfo?.memberId);
    // console.log("판매자 id :", sellerId);

    return userInfo?.memberId === sellerId;
};

export default useSellerCheck;