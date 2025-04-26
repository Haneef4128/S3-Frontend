import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    room_no: "",
    date_of_joining: "",
    status: "Occupied",
    remarks: ""
  });
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
    fetchRooms();
  }, []);  // ✅ Empty dependency array to run only once

  // ✅ Function to fetch tenants
  const fetchTenants = async () => {
    try {
      const response = await axios.get("https://s3-backend-29sp.onrender.com/tenants/", { withCredentials: true });
      setTenants(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  // ✅ Function to fetch rooms
  const fetchRooms = async () => {
    try {
      const response = await axios.get("https://s3-backend-29sp.onrender.com/rooms/", { withCredentials: true });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

const availableRooms = rooms.filter(room => room.vacant > 0);


const handleRowClick = (tenant) => {
  setEditingTenant(tenant);  // ✅ Set tenant data in state
  setEditModalIsOpen(true);      // ✅ Open modal
};

const handleChange = (e, isEditing = false) => {
  const { name, value } = e.target;

  if (isEditing) {
    setEditingTenant((prevTenant) => ({
      ...prevTenant,
      [name]: value,
    }));
  } else {
    setNewTenant((prevTenant) => ({
      ...prevTenant,
      [name]: value,
    }));
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting payload:", newTenant);  // ✅ Debugging log
  
  try {
    const response = await fetch("https://s3-backend-29sp.onrender.com/tenants/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newTenant),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    setAddModalIsOpen(false);  
    fetchTenants();  
    fetchRooms();  
  } catch (error) {
    console.error("Error adding tenant:", error);
  }
};


const handleDelete = async (tenantId) => {
  console.log("Attempting to delete tenant with ID:", tenantId);

  try {
    const response = await axios.delete(`https://s3-backend-29sp.onrender.com/tenants/${tenantId}/`, {
      withCredentials: true,
    });

    if (response.status === 204) {
      console.log("Tenant deleted successfully:", tenantId);
      setTenants(prevTenants => prevTenants.filter((tenant) => tenant.id !== tenantId));
      fetchRooms();  // ✅ Refresh room data
    }
  } catch (error) {
    console.error("Error deleting tenant:", error);

    if (error.response && error.response.status === 404) {
      console.warn("Tenant was not found in DB, removing from UI...");
      setTenants(prevTenants => prevTenants.filter((tenant) => tenant.id !== tenantId));
    }
  }
};





const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(`https://s3-backend-29sp.onrender.com/tenants/${editingTenant.id}/`, editingTenant, {
      withCredentials: true,
    });

    setTenants(tenants.map((tenant) => tenant.id === editingTenant.id ? response.data : tenant)); // ✅ Update UI
    setEditModalIsOpen(false); // ✅ Close modal
  } catch (error) {
    console.error("Error updating tenant:", error);
  }
};

const getFloorFromRoomNo = (roomNo) => {
  if (!roomNo) return "";
  const firstChar = roomNo.toString().charAt(0); // Get first character
  if (firstChar === "2") return "2nd Floor";
  if (firstChar === "3") return "3rd Floor";
  return "Unknown"; // Default if not 2 or 3
};

// Function to filter tenants based on search input & floor
const filteredTenants = tenants.filter((tenant) =>
  (tenant.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  (tenant.room_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  (tenant.date_of_joining || "").includes(searchQuery) ||
  (tenant.status || "").toLowerCase().includes(searchQuery.toLowerCase())
).filter(tenant => 
  selectedFloor === "" || getFloorFromRoomNo(tenant.room_no) === selectedFloor // ✅ Filter by floor
);



  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Tenant Management</h2>
        <button style={{margin: 'auto 0'}} onClick={() => setAddModalIsOpen(true)} className="add-expense-btn">+ Add Tenant</button>
      </div>
<div style={{display: "flex"}}>
      <Input.Search
        style={{ width: '20%', marginTop: '1em', marginRight: '1em' }}
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

<select style={{width: '15%'}} value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
          <option value="">All Floors</option>
          <option value="2nd Floor">2nd Floor</option>
          <option value="3rd Floor">3rd Floor</option>
        </select>
        </div>
      
      <table className="expense-list" style={{marginTop: '0'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Room</th>
            <th>Date of Joining</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTenants.map(tenant => (
            <tr key={tenant.id} onClick={() => handleRowClick(tenant)}>
              <td>{tenant.name}</td>
              <td>{tenant.room_no}</td>
              <td>{tenant.date_of_joining}</td>
              <td>{tenant.status}</td>
              <td>{tenant.remarks}</td>
              <td className="expense-actions">
                <button  onClick={(e) => {e.stopPropagation(); handleDelete(tenant.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={addModalIsOpen} onRequestClose={() => setAddModalIsOpen(false)} className="modal">
        <h2>Add Tenant</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={newTenant.name} onChange={handleChange} required />

          <label>Room No:</label>
          <select 
  name="room_no" 
  value={newTenant.room_no} 
  onChange={handleChange} 
  required
>
  <option value="">Select a Room</option>
  {availableRooms.map(room => (
    <option key={room.room_no} value={room.room_no}>  
      {room.room_no} (Vacant: {room.vacant}) {/* ✅ Displays full info */}
    </option>
  ))}
</select>

          <label>Date of Joining:</label>
          <input type="date" name="date_of_joining" value={newTenant.date_of_joining} onChange={handleChange} required />

          <label>Status:</label>
          <select name="status" value={newTenant.status} onChange={handleChange} required>
            <option value="Occupied">Occupied</option>
            <option value="Booked">Booked</option>
          </select>

          <label>Remarks:</label>
          <textarea name="remarks" value={newTenant.remarks} onChange={handleChange}></textarea>

          <button type="submit" style={{marginRight:"1em"}}>Add Tenant</button>
          <button type="button" onClick={() => setAddModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>
      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} className="modal">
        <h2>Edit Tenant</h2>
        {editingTenant && (
          <form onSubmit={handleUpdate}>
            <label>Name:</label>
            <input type="text" name="name" value={editingTenant.name} onChange={(e) => handleChange(e, true)} required />

            <label>Room No:</label>
            <input type="text" name="room_no" value={editingTenant.room_no} onChange={(e) => handleChange(e, true)} required />

            <label>Date of Joining:</label>
            <input type="date" name="date_of_joining" value={editingTenant.date_of_joining} onChange={(e) => handleChange(e, true)} required />

            <label>Status:</label>
            <select name="status" value={editingTenant.status} onChange={(e) => handleChange(e, true)}>
              <option value="Occupied">Occupied</option>
              {/* <option value="Vacated">Vacated</option> */}
              <option value="Booked">Booked</option>
            </select>

            <label>Remarks:</label>
            <textarea name="remarks" value={editingTenant.remarks} onChange={(e) => handleChange(e, true)}></textarea>

            <button type="submit" style={{ marginRight: "1em" }}>Save Changes</button>
            <button type="button" onClick={() => setEditModalIsOpen(false)}>Cancel</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TenantManagement;
