import React from "react";
import { NavLink } from "react-router";

const MyLink = ({ to, className, children }) => {
    return (
        <div>
            <NavLink
                to={to}
                className={({ isActive }) =>
                    isActive ? "text-[#875DF8] text-base font-medium" : `${className}`
                }
            >
                {children}
            </NavLink>
        </div>
    );
};

export default MyLink;