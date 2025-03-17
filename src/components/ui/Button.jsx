import React from "react";
import styles from "./Button.module.css";

const Button = ({ width = "auto", height = "auto", fontSize = "0.875rem", onClick, children, ...props }) => {
    const buttonStyle = {
        width: width === "auto" ? "auto" : `${width}px`,
        height: height === "auto" ? "auto" : `${height}px`,
        fontSize: fontSize === "auto" ? "0.875rem" : `${fontSize}rem`,
    };

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