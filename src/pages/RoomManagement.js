import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  useEffect(() => {
    axios.get("https://s3-backend-29sp.onrender.com/rooms/", { withCredentials: true })
    .then((response) => {
      setRooms(response.data);
    })
    .catch((error) => {
      console.error("Error fetching tenants:", error);
    });
}, []); 

const filteredRooms = rooms.filter((room) =>
  (room.room_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  (room.room_no || "").includes(searchQuery)
).filter(room => 
  selectedFloor === "" || room.floor === Number(selectedFloor)
);


  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Room Management</h2>
        {/* <button className="add-expense-btn">+ Add Rent Payment</button> */}
      </div>

      <div style={{display: "flex"}}>
            <Input.Search
              style={{ width: '20%', marginTop: '1em', marginRight: '1em' }}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
      
      <select style={{width: '15%'}} value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                <option value="">All Floors</option>
                <option value="2">2nd Floor</option>
                <option value="3">3rd Floor</option>
              </select>
        </div>
      
      <table className="expense-list">
        <thead>
          <tr>
            {/* <th>Floor</th> */}
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Capacity</th>
            <th>Total Beds</th>
            <th>Occupied</th>
            <th>Booked</th>
            <th>Vacant</th>
            {/* <th>Action</th> */}
          </tr>
        </thead> 
        <tbody>
          {filteredRooms.map(room => (
            <tr key={room.id}>
              {/* <td>{room.floor}</td> */}
              <td>{room.room_no}</td>
              <td>{room.room_type}</td>
              <td>{room.capacity}</td>
              <td>{room.total_beds}</td>
              <td>{room.occupied_count}</td>
              <td>{room.booked}</td>
              <td>{room.vacant}</td>
              {/* <td className="expense-actions">
                <button>Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomManagement;
