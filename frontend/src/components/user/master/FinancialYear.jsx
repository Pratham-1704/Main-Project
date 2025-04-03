import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, message, Table, DatePicker, Input, Popconfirm } from "antd";
import axios from "axios";
import moment from "moment";
import "./Css Files/style.css"; // Import custom styles

function FinancialYear() {
  const [formData, setFormData] = useState({
    name: "",
    startdate: null,
    enddate: null,
  });

  const [financialYears, setFinancialYears] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch financial years from backend
  const fetchFinancialYears = async () => {
    try {
      const response = await axios.get("http://localhost:8081/financialYear");
      setFinancialYears(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching financial years:", error);
      setFinancialYears([]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date changes
  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date ? moment(date).format("YYYY-MM-DD") : null });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name || !formData.startdate || !formData.enddate) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/financialYear", formData);
      messageApi.open({ type: "success", content: "Financial Year added successfully!" });
      fetchFinancialYears();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to add financial year!" });
    }
  };

  // Handle update
  const handleUpdate = async (record) => {
    try {
      await axios.put(`http://localhost:8081/financialYear/${record._id}`, record);
      messageApi.open({ type: "success", content: "Financial Year updated successfully!" });
      fetchFinancialYears();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update financial year!" });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/financialYear/${id}`);
      messageApi.open({ type: "success", content: "Financial Year deleted successfully!" });
      fetchFinancialYears();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete financial year!" });
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({ name: "", startdate: null, enddate: null });
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Start Date", dataIndex: "startdate", key: "startdate" },
    { title: "End Date", dataIndex: "enddate", key: "enddate" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="link"
            onClick={() => setFormData(record)}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this financial year?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Financial Years</h1>
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
                    Name*
                    <Input
                      name="name"
                      placeholder="Enter Financial Year Name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Start Date*
                    <DatePicker
                      name="startdate"
                      placeholder="Select Start Date"
                      value={formData.startdate ? moment(formData.startdate) : null}
                      onChange={(date) => handleDateChange("startdate", date)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    End Date*
                    <DatePicker
                      name="enddate"
                      placeholder="Select End Date"
                      value={formData.enddate ? moment(formData.enddate) : null}
                      onChange={(date) => handleDateChange("enddate", date)}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit} style={{ marginRight: "10px" }}>
                      Save
                    </Button>
                    <Button onClick={clearForm} style={{ marginRight: "10px" }}>
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
