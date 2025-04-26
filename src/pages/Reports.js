import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [roomData, setRoomData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    // Fetch Room Occupancy Data
    axios.get("https://s3-backend-29sp.onrender.com/room-occupancy/")
      .then((response) => setRoomData(response.data))
      .catch((error) => console.error("Error fetching room occupancy:", error));

    // Fetch Revenue Data
    axios.get("https://s3-backend-29sp.onrender.com/revenue-over-time/")
      .then((response) => setRevenueData(response.data))
      .catch((error) => console.error("Error fetching revenue data:", error));

    // Fetch Maintenance Status Data
    axios.get("https://s3-backend-29sp.onrender.com/maintenance-status/")
      .then((response) => setMaintenanceData(response.data))
      .catch((error) => console.error("Error fetching maintenance data:", error));
  }, []);

  return (
    <div className="reports">
      <h2>Reports & Analytics</h2>

      <div className="charts">
        {/* Room Occupancy Chart */}
        <div className="chart">
          <h3>Room Occupancy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={roomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="available" stroke="#82ca9d" />
              <Line type="monotone" dataKey="booked" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="chart">
          <h3>Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Requests Pie Chart */}
        <div className="chart">
          <h3>Maintenance Requests Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={maintenanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#ff6347" : "#82ca9d"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table for detailed room and revenue data */}
      <div className="table">
        <h3>Room and Revenue Data</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Available Rooms</th>
              <th>Booked Rooms</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {roomData.map((data, index) => (
              <tr key={index}>
                <td>{data.month}</td>
                <td>{data.available}</td>
                <td>{data.booked}</td>
                <td>${revenueData[index]?.revenue || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
