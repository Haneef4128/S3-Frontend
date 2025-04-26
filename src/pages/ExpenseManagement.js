import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
      expense: "",
      expense_type: "",
      amount: "",
      expense_date: "",
    });

  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [totalExpense, setTotalExpense] = useState(0);
// const [filteredExpenses, setFilteredExpenses] = useState([]); 


    useEffect(() => {
      fetchExpenses();
    }, []);  // ✅ Empty dependency array to run only once
  
    // ✅ Function to fetch tenants
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("https://s3-backend-29sp.onrender.com/expenses/", { withCredentials: true });
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    const handleRowClick = (expense) => {
      setEditingExpense(expense);  // ✅ Set tenant data in state
      setEditModalIsOpen(true);      // ✅ Open modal
    };
    
    const handleChange = (e, isEditing = false) => {
      const { name, value } = e.target;
    
      if (isEditing) {
        setEditingExpense((prevExpense) => ({
          ...prevExpense,
          [name]: value,
        }));
      } else {
        setNewExpense((prevExpense) => ({
          ...prevExpense,
          [name]: value,
        }));
      }
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`https://s3-backend-29sp.onrender.com/expenses/${editingExpense.id}/`, editingExpense, {
          withCredentials: true,
        });
    
        setExpenses(expenses.map((expense) => expense.id === editingExpense.id ? response.data : expense)); // ✅ Update UI
        setEditModalIsOpen(false); // ✅ Close modal
      } catch (error) {
        console.error("Error updating tenant:", error);
      }
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    ...newExpense,
    expense_type: newExpense.expense_type || "Direct",  // ✅ Ensure it's set
    amount: parseFloat(newExpense.amount),  // Convert amount to float
  };
  console.log("Submitting payload:", payload);

  try {
    const response = await fetch("https://s3-backend-29sp.onrender.com/expenses/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    setAddModalIsOpen(false);
    fetchExpenses();
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};


  const handleDelete = async (expenseId) => {
    console.log("Attempting to delete expense with ID:", expenseId);
  
    try {
      const response = await axios.delete(`https://s3-backend-29sp.onrender.com/expenses/${expenseId}/`, {
        withCredentials: true,
      });
  
      if (response.status === 204) {
        console.log("Expense deleted successfully:", expenseId);
        setExpenses(prevExpenses => prevExpenses.filter((expense) => expense.id !== expenseId));
        fetchExpenses();  // ✅ Refresh room data
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
  
      if (error.response && error.response.status === 404) {
        console.warn("Expense was not found in DB, removing from UI...");
        setExpenses(prevExpenses => prevExpenses.filter((expense) => expense.id !== expenseId));
      }
    }
  };
  
  // const [expenses, setExpenses] = useState([
  //   { id: 1, name: "Electricity Bill", amount: 1200, date: "2024-02-15" },
  //   { id: 2, name: "Water Bill", amount: 800, date: "2024-02-10" },
  // ]);

  // const handleDelete = (id) => {
  //   setExpenses(expenses.filter(expense => expense.id !== id));
  // };

  // const filteredExpenses = expenses.filter((expense) =>
  //   (expense.expense || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   (expense.expense_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   (expense.expense_date || "").includes(searchQuery)
  // );
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      (expense.expense || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.expense_type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.expense_date || "").includes(searchQuery);
  
    const expenseDate = new Date(expense.expense_date);
    const isWithinDateRange = 
      (!fromDate || expenseDate >= new Date(fromDate)) &&
      (!toDate || expenseDate <= new Date(toDate));
  
    return matchesSearch && isWithinDateRange;
  });

  const calculateTotalExpense = () => {
    return filteredExpenses.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setTotalExpense(0); // Reset total expense
  };
  
  

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Expense Management</h2>
        <button onClick={() => setAddModalIsOpen(true)} className="add-expense-btn">+ Add Expense</button>
      </div>
      <div style={{display: "flex"}}>
            <Input.Search
              style={{ width: '20%', marginTop: '1em', marginRight: '1em' }}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "1em", marginBottom: "1em" }}>
  <label>From: </label>
  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />

  <label>To: </label>
  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

  <button onClick={clearFilters} style={{ padding: "0.5em 1em", cursor: "pointer", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", margin: "auto 0" }}>
    Clear
  </button>

</div>

          </div>
      
      <table className="expense-list">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Type</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map(expense => (
            <tr key={expense.id} onClick={() => handleRowClick(expense)}>
              <td>{expense.expense}</td>
              <td>{expense.expense_type}</td>
              <td>{expense.amount}</td>
              <td>{expense.expense_date}</td>
              <td className="expense-actions">
                <button onClick={(e) => {e.stopPropagation(); handleDelete(expense.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "1em", fontSize: "1.2em", fontWeight: "bold" }}>
  Total Expense: ₹ {calculateTotalExpense().toFixed(2)}
</div>

      <Modal isOpen={addModalIsOpen} onRequestClose={() => setAddModalIsOpen(false)} className="modal">
              <h2>Add Expense</h2>
              <form onSubmit={handleSubmit}>
                <label>Expense:</label>
                <input type="text" name="expense" value={newExpense.expense} onChange={handleChange} required />
      
                <label>Type:</label>
                <select name="expense_type" value={newExpense.expense_type} onChange={handleChange} required>
                  <option value="Direct">Direct</option>
                  <option value="Indirect">Indirect</option>
                  <option value="Direct Receipts">Direct Receipts</option>
                  <option value="Indirect Receipts">Indirect Receipts</option>
                  <option value="Loan & Advances">Loans & Advances</option>
                  <option value="Staff Salary">Staff Salary</option>
                  <option value="Directors Renumeration">Directors Renumerations</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>

                <label>Amount:</label>
                <input type="number" name="amount" value={newExpense.amount} onChange={handleChange} required />
      
                <label>Date of Expense:</label>
                <input type="date" name="expense_date" value={newExpense.expense_date} onChange={handleChange} required />
      
                <button type="submit" style={{marginRight:"1em"}}>Add Expense</button>
                <button type="button" onClick={() => setAddModalIsOpen(false)}>Cancel</button>
              </form>
            </Modal>
            <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} className="modal">
              <h2>Edit Expense</h2>
              {editingExpense && (
          <form onSubmit={handleUpdate}>
            <label>Expense:</label>
                <input type="text" name="expense" value={editingExpense.expense} onChange={(e) => handleChange(e, true)} required />
      
                <label>Type:</label>
                <select name="expense_type" value={editingExpense.expense_type} onChange={(e) => handleChange(e, true)} required>
                  <option value="Direct">Direct</option>
                  <option value="Indirect">Indirect</option>
                  <option value="DR">Direct Receipts</option>
                  <option value="IR">Indirect Receipts</option>
                  <option value="L&A">Loans & Advances</option>
                  <option value="Salary">Staff Salary</option>
                  <option value="Renumeration">Directors Renumerations</option>
                  <option value="Misc">Miscellaneous</option>
                </select>

                <label>Amount:</label>
                <input type="number" name="amount" value={editingExpense.amount} onChange={(e) => handleChange(e, true)} required />
      
                <label>Date of Expense:</label>
                <input type="date" name="expense_date" value={editingExpense.expense_date} onChange={(e) => handleChange(e, true)} required />

            <button type="submit" style={{ marginRight: "1em" }}>Save Changes</button>
            <button type="button" onClick={() => setEditModalIsOpen(false)}>Cancel</button>
          </form>
        )}
            </Modal>
    </div>
  );
};

export default ExpenseManagement;
