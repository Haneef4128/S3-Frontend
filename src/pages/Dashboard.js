import React, { useState, useEffect, use } from "react";
import { FaBed, FaClipboardList, FaMoneyBillWave, FaExclamationTriangle, FaChartLine, FaCalendarAlt, FaTimes } from "react-icons/fa";
import ApexCharts from "react-apexcharts";
import axios from "axios";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [bookedRooms, setBookedRooms] = useState(0);
  const [bedDetails, setBedDetails] = useState([]);

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const [inmatesCount, setInmatesCount] = useState(0);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [expense, setExpense] = useState(0);
  const [issues, setIssues] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [paidRent, setPaidRent] = useState(0);
  const [expenseStats, setExpenseStats] = useState(0);


  useEffect(() => {
    axios
      .get("https://s3-backend-29sp.onrender.com/expenses/", { withCredentials: true })
      .then((response) => {
        const data = response.data;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
  
        let totalCost = 0;
        data.forEach((x) => {
          const expenseDate = new Date(x.expense_date);
          if (expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear) {
            totalCost += parseFloat(x.amount);  // ✅ Convert amount to a number
          }
        });
  
        setExpense(totalCost.toFixed(2));  // ✅ Ensure two decimal places
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }, []);
  

  useEffect(() => {
    axios.get("https://s3-backend-29sp.onrender.com/submit-form/", { withCredentials: true})
    .then((response) => {
      const data = response.data
      let totalIssues = 0
      data.forEach((x) => {
        totalIssues += 1;
      })
      setIssues(totalIssues);
    })
    .catch((error) => {
      console.error("Error fetching forms:", error);
    });
}, []); 

  useEffect(()=> {
    axios.get("https://s3-backend-29sp.onrender.com/rent/", { withCredentials: true})
    .then((response) => {
      const data = response.data
      let totalRent = 0
      let totalPaidRent = 0
      data.forEach((x) => {
        totalRent = x.paid_amt + x.due_amt 
        totalPaidRent += x.paid_amt
      })
      setTotalRent(totalRent)
      setPaidRent(totalPaidRent)
    })
    .catch((error) => {
      console.error("Error fetching rents:", error);
    });
}, []); 

useEffect(() => {
  axios
    .get("https://s3-backend-29sp.onrender.com/tenants/", { withCredentials: true })
    .then((response) => {
      const occupiedInmates = response.data.filter((tenant) => tenant.status.toLowerCase() === "occupied");
      setInmatesCount(occupiedInmates.length);
    })
    .catch((error) => console.error("Error fetching inmates data:", error));
}, []);


  useEffect(() => {
    axios
      .get("https://s3-backend-29sp.onrender.com/rooms/", { withCredentials: true }) // Replace with actual API endpoint
      .then((response) => {
        const data = response.data;
        setRooms(data);

        // Calculate available beds
        let totalBeds = 0;
        let occupiedBeds = 0;
        let bookedBeds = 0;
        let bedInfo = {};

        data.forEach((room) => {
          totalBeds += room.total_beds;
          occupiedBeds += room.occupied_count;
          bookedBeds += room.booked;

          const key = `${room.capacity} in 1 ${room.room_type} Room`;
          const availableBeds = room.total_beds - room.occupied_count - room.booked;

          if (availableBeds > 0) {
            if (bedInfo[key]) {
              bedInfo[key] += availableBeds;
            } else {
              bedInfo[key] = availableBeds;
            }
          }
        });

        setTotalCapacity(totalBeds);
        setAvailableBeds(totalBeds - occupiedBeds - bookedBeds);
        setBookedRooms(data.filter((room) => room.booked).length);
        setBedDetails(Object.entries(bedInfo).map(([type, count]) => ({ type, count })));
      })
      .catch((error) => console.error("Error fetching room data:", error));
  }, []);

  useEffect(()=> {
    axios.get("https://s3-backend-29sp.onrender.com/expense-stats/", { withCredentials: true})
    .then((response) => {
      setExpenseStats(response.data)
    })
    .catch((error) => {
      console.error("Error fetching expenses stats:", error);
    });
}, []); 

  // Example Stats (Modify based on API data)
  // const expenseStats = {
  //   twoMonthsBack: 50000,
  //   lastMonth: 60000,
  //   thisMonth: 70000,
  // };

  const profitStats = {
    lastMonthProfit: 140000,
    thisMonthProfit: 130000,
    yearToDate: 1200000,
  };

  // const totalRent = bookedRooms * 25000;

  return (
    <div className="dashboard-container">
      <div style={{ backgroundColor: "#f4f4f4", padding: "5px 25px", borderRadius: "5px", marginBottom: "20px" }}>
        <h1 className="dashboard-header">
          <FaCalendarAlt className="calendar-icon" /> {currentMonth} {currentYear}
        </h1>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer" }}>
            <FaBed className="icon" />
            <h3>Beds Available</h3>
            <p>{availableBeds}</p>
            <p style={{ marginTop: "-10px", fontSize: "0.9rem", color: "#555" }}>
    Out of {totalCapacity}
  </p>
          </div>
          <div className="stat-card">
            <FaClipboardList className="icon" />
            <h3>Inmates</h3>
            <p>{inmatesCount}</p>
          </div>
          <div className="stat-card">
            <FaMoneyBillWave className="icon" />
            <h3>Expenses</h3>
            <p>₹{parseFloat(expense).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <FaExclamationTriangle className="icon" />
            <h3>Issues</h3>
            <p>{issues}</p>
          </div>
          <div className="stat-card">
            <FaChartLine className="icon" />
            <h3>Rent Collected</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{paidRent}</p>
            <p style={{ marginTop: "-15px", fontSize: "0.9rem", color: "#555" }}>Out of ₹{totalRent}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts">
        <div className="chart-container">
          <h2>Expense Stats</h2>
          <ApexCharts
            options={{
              chart: { type: "bar" },
              xaxis: { categories: ["2 Months Ago", "Last Month", "This Month"] },
              colors: ["#FF5733"],
            }}
            series={[{ name: "Expenses", data: Object.values(expenseStats) }]}
            type="bar"
            height={300}
          />
        </div>

        <div className="chart-container">
          <h2>Profit Stats</h2>
          <ApexCharts
            options={{
              chart: { type: "bar" },
              xaxis: { categories: ["Last Month", "This Month", "Year-To-Date"] },
              colors: ["#28A745"],
            }}
            series={[{ name: "Profit", data: Object.values(profitStats) }]}
            type="bar"
            height={300}
          />
        </div>
      </div>

      {/* Modal for Available Beds */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>
            <h2>Available Beds Details</h2>
            {bedDetails.length > 0 ? (
              <ul>
                {bedDetails.map((bed, index) => (
                  <li key={index}>
                    <span>{bed.type}</span>
                    <span>x {bed.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>No available beds.</p>
            )}
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
