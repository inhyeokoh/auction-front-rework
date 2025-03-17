import React from "react";
import styles from "./input.module.css";

const Input = ({ type = "text", className, ...props }) => {
    return (
        <input
            type={type}
            className={`${styles.input} ${className}`}
            {...props}
        />
    );
};

export default Input;