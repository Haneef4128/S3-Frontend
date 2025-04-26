import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const RentCollection = () => {
  const [rentData, setRentData] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    fetchRentData();
  }, []);

  const fetchRentData = async () => {
    try {
      const response = await axios.get("https://s3-backend-29sp.onrender.com/rents/");
      setRentData(response.data);
    } catch (error) {
      console.error("Error fetching rent data:", error);
    }
  };

  const handleFullPayment = async (tenantId, fullAmount) => {
    try {
      await axios.post(`https://s3-backend-29sp.onrender.com/rents/${tenantId}/`, {
        paid_amount: fullAmount,
      });
      fetchRentData(); // ✅ Refresh UI
    } catch (error) {
      console.error("Error making full payment:", error);
    }
  };

  const handlePartialPayment = async () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
  
    const paymentAmount = parseFloat(customAmount);
  
    // ✅ Prevent overpayment
    if (paymentAmount > selectedTenant.due_amount) {
      alert("You cannot pay more than the due amount.");
      return;
    }
  
    const newDueAmount = selectedTenant.due_amount - paymentAmount; // ✅ Reduce due
    const newPaidAmount = selectedTenant.paid_amount + paymentAmount; // ✅ Increase paid
  
    try {
      await axios.post(`https://s3-backend-29sp.onrender.com/rents/${selectedTenant.tenant_id}/`, {
        paid_amount: paymentAmount,
      });
  
      setRentData((prevData) =>
        prevData.map((tenant) =>
          tenant.tenant_id === selectedTenant.tenant_id
            ? {
                ...tenant,
                due_amount: newDueAmount, // ✅ Update due
                paid_amount: newPaidAmount, // ✅ Update paid
                is_paid: newDueAmount === 0, // ✅ Mark paid if no due
              }
            : tenant
        )
      );
  
      setSelectedTenant(null); // ✅ Close Modal
      setCustomAmount(""); // ✅ Clear input
    } catch (error) {
      console.error("Error making partial payment:", error);
    }
  };
  

  return (
    <div className="expense-container">
      <div className="expense-header">
      <h2>Rent Collection</h2>
      </div>
      <table className="expense-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Month</th>
            <th>Room</th>
            <th>Total</th>
            <th>Due</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rentData.map((tenant) => (
            <tr key={tenant.tenant_id} onClick={() => setSelectedTenant(tenant)}>
              <td>{tenant.tenant_name}</td>
              <td>{tenant.month}</td>
              <td>{tenant.room_no}</td>
              <td>₹{tenant.total_rent}</td>
              <td>₹{tenant.due_amount}</td>
              <td>₹{tenant.paid_amount}</td>
              <td style={{ color: tenant.is_paid ? "green" : "red" }}>
                {tenant.is_paid ? "Paid" : "Due"}
              </td>
              <td>
                {!tenant.is_paid && (
                  <button onClick={(e) => {
                    e.stopPropagation(); // ✅ Prevent modal from opening
                    handleFullPayment(tenant.tenant_id, tenant.due_amount);
                  }}>
                    Pay Full
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Modal for Partial Payment */}
      <Modal isOpen={!!selectedTenant} onRequestClose={() => setSelectedTenant(null)} className="modal">
        <h2>Make Partial Payment</h2>
        <p>Tenant: {selectedTenant?.tenant_name}</p>
        <p>Due Amount: ₹{selectedTenant?.due_amount}</p>
        <input
          type="number"
          placeholder="Enter Amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
        <button onClick={handlePartialPayment} style={{marginRight: '1em', backgroundColor: 'blue'}}>Pay</button>
        <button onClick={() => setSelectedTenant(null)} style={{backgroundColor: 'red'}}>Cancel</button>
      </Modal>
    </div>
  );
};

export default RentCollection;
