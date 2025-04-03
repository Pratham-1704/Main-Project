import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, message, Table, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import "./Css Files/style.css"; // Import the custom CSS file

function FinancialYear() {
  const [formData, setFormData] = useState({
    startdate: null,
    enddate: null,
  });

  const [financialYears, setFinancialYears] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch financial years from the backend
  const fetchFinancialYears = async () => {
    try {
      const response = await axios.get("http://localhost:8081/financialYear");
      setFinancialYears(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching financial years:", error);
      setFinancialYears([]);
    }
  };

  // Handle date changes
  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date ? moment(date).format("YYYY-MM-DD") : null });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.startdate || !formData.enddate) {
      messageApi.open({ type: "error", content: "Both Start Date and End Date are required!" });
      return;
    }

    console.log("Submitting form data:", formData); // Debugging

    try {
      const response = await axios.post("http://localhost:8081/financialYear", formData);
      console.log("Response from server:", response.data); // Debugging
      messageApi.open({ type: "success", content: "Financial Year saved successfully!" });
      fetchFinancialYears();
      clearForm();
    } catch (error) {
      console.error("Error:", error.response || error); // Debugging
      messageApi.open({ type: "error", content: "Failed to save financial year!" });
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a financial year to update!" });
      return;
    }

    try {
      await axios.put(`http://localhost:8081/financialYear/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Financial Year updated successfully!" });
      fetchFinancialYears();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update financial year!" });
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a financial year to delete!" });
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/financialYear/${formData._id}`);
      messageApi.open({ type: "success", content: "Financial Year deleted successfully!" });
      fetchFinancialYears();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete financial year!" });
      console.error("Error:", error);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      startdate: null,
      enddate: null,
    });
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Start Date", dataIndex: "startdate", key: "startdate" },
    { title: "End Date", dataIndex: "enddate", key: "enddate" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Financial Year Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Financial Years</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Start Date*
                    <DatePicker
                      name="startdate"
                      placeholder="Select Start Date"
                      value={formData.startdate ? moment(formData.startdate) : null}
                      onChange={(date, dateString) => handleDateChange("startdate", date, dateString)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    End Date*
                    <DatePicker
                      name="enddate"
                      placeholder="Select End Date"
                      value={formData.enddate ? moment(formData.enddate) : null}
                      onChange={(date, dateString) => handleDateChange("enddate", date, dateString)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                      color="green"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="danger"
                      onClick={handleDelete}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={clearForm}
                      style={{ marginRight: "10px" }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={financialYears}
                  rowKey="_id"
                  onRow={(record) => ({
                    onClick: () => {
                      setFormData(record); // Populate form with selected row data
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default FinancialYear;
