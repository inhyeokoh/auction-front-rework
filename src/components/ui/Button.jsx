import React from "react";
import styles from "./Button.module.css";

const Button = ({ width, height, fontSize, onClick, children, ...props }) => {
    // 옵션이 제공될 때만 스타일 속성 추가
    const buttonStyle = {};

    if (width) buttonStyle.width = `${width}px`;
    if (height) buttonStyle.height = `${height}px`;
    if (fontSize) buttonStyle.fontSize = `${fontSize}rem`;

    // width가 지정되지 않은 경우에만 fit-content 적용
    if (!width) buttonStyle.width = "fit-content";

    return (
        <button
            className={styles.button}
            style={buttonStyle}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;