import React from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useLocation
import Logo from '../assets/S3Logo.png';
import { MdSpaceDashboard, MdBedroomParent, MdBuild, MdOutlineAttachMoney } from "react-icons/md";
import { FaUserAlt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Get current route

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div>
        <img style={{ width: "100px", height: "100px", marginTop: "1em" }} src={Logo} alt="Logo" />
      </div>
      <ul>
        <li 
          onClick={() => handleNavigation("/")} 
          className={location.pathname === "/" ? "active" : ""}
        >
          <MdSpaceDashboard style={{ marginRight: "8px", fontSize: "20px" }}/>Dashboard
        </li>

        <li 
          onClick={() => handleNavigation("/tenant-management")} 
          className={location.pathname === "/tenant-management" ? "active" : ""}
        >
          <FaUserAlt style={{ marginRight: "8px", fontSize: "20px" }}/>Tenant Management
        </li>

        <li 
          onClick={() => handleNavigation("/room-management")} 
          className={location.pathname === "/room-management" ? "active" : ""}
        >
          <MdBedroomParent style={{ marginRight: "8px", fontSize: "20px" }}/>Room Management
        </li>

        <li 
          onClick={() => handleNavigation("/rent-collection")} 
          className={location.pathname === "/rent-collection" ? "active" : ""}
        >
          <FaMoneyBillWave style={{ marginRight: "8px", fontSize: "20px" }}/>Rent Collection
        </li>

        <li 
          onClick={() => handleNavigation("/expense-management")} 
          className={location.pathname === "/expense-management" ? "active" : ""}
        >
          <MdOutlineAttachMoney style={{ marginRight: "8px", fontSize: "25px" }}/>Expense Management
        </li>

        <li 
          onClick={() => handleNavigation("/maintenance-requests")} 
          className={location.pathname === "/maintenance-requests" ? "active" : ""}
        >
          <MdBuild style={{ marginRight: "8px", fontSize: "20px" }}/>Maintenance Requests
        </li>

        {/* <li 
          onClick={() => handleNavigation("/reports")} 
          className={location.pathname === "/reports" ? "active" : ""}
        >
          <FaChartLine style={{ marginRight: "8px", fontSize: "20px" }}/>Reports & Analytics
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
