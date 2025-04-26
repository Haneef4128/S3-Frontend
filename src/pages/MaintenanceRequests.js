import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiExternalLink } from "react-icons/fi";

const MaintenanceRequests = () => {
  const [initialRequests, setInitialRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);  // ✅ Empty dependency array to run only once

  // ✅ Function to fetch tenants
  const fetchRequests = async () => {
    try {
      const response = await axios.get("https://s3-backend-29sp.onrender.com/submit-form/", { withCredentials: true });
      setInitialRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleDelete = async (requestId) => {
    console.log("Attempting to delete request with ID:", requestId);
  
    try {
      const response = await axios.delete(`https://s3-backend-29sp.onrender.com/delete_request/${requestId}/`, {
        withCredentials: true,
      });
  
      if (response.status === 204) {
        console.log("Request deleted successfully:", requestId);
        setInitialRequests(prevRequests => prevRequests.filter((request) => request.id !== requestId));
        fetchRequests();  // ✅ Refresh room data
      }
    } catch (error) {
      console.error("Error deleting request:", error);
  
      if (error.response && error.response.status === 404) {
        console.warn("Request was not found in DB, removing from UI...");
        setInitialRequests(prevRequests => prevRequests.filter((request) => request.id !== requestId));
      }
    }
  };

  // useEffect(() => {
  //   axios.get("https://s3-backend-29sp.onrender.com/submit-form/")
  //   .then((response) => {
  //     setInitialRequests(response.data);
  //   })
  //   .catch((error) => {
  //     console.log("Error fetching issues: ", error);
  //   })
  // }, [])
  // const initialRequests = [
  //      { id: 1, tenantName: "John Doe", roomNumber: "101", issue: "Leaking faucet", status: "Open" },
  //      { id: 2, tenantName: "Jane Smith", roomNumber: "102", issue: "Broken window", status: "In Progress" },
  //      { id: 3, tenantName: "Samuel Lee", roomNumber: "103", issue: "AC not working", status: "Closed" },
  //    ];

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Maintenance Requests</h2>
        {/* <button className="add-expense-btn">+ Add Maintenance Request</button> */}
      </div>
      
      <table className="expense-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Room</th>
            <th>Issue</th>
            <th>Date</th>
            {/* <th>Status</th> */}
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {initialRequests.map(request => (
            <tr key={request.id}>
              <td>{request.tenant_name}</td>
              <td>{request.contact_number}</td>
              <td>{request.room_no}</td>
              <td>{request.issue}</td>
              <td>{request.issue_date}</td>
              {/* <td>{request.status}</td> */}
              <td>{request.attachment ? (
                  <a href={request.attachment} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink size={20} style={{ color: "blue" }} />
                  </a>
                ) : (
                  "No Attachment"
                )}</td>
              <td className="expense-actions">
                <button onClick={(e) => {e.stopPropagation(); handleDelete(request.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRequests;
