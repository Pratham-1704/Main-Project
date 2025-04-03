<<<<<<< HEAD
import React from 'react'

function FinancialYear() {
  return (
    <div>FinancialYear</div>
  )
}

export default FinancialYear
=======
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button, Input, Select, Table, message } from "antd";
import axios from "axios";

function FinancialYear() {
  const [formData, setFormData] = useState({
    id: "",
    startDate: "",
    endDate: "",
    name: "",
  });

  const [financialYear, setFinancialYear] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch financial years from the backend
  const fetchFinancialYears = async () => {
    try {
      const response = await axios.get("http://localhost:8081/financialYear");
      const data = Array.isArray(response.data) ? response.data : [];
      setFinancialYear(data);
    } catch (error) {
      console.error("Error fetching financial year:", error);
      setFinancialYear([]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.id || !formData.startDate || !formData.endDate || !formData.name) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/financialYear", formData);
      messageApi.open({ type: "success", content: "Data saved successfully!" });
      fetchFinancialYear();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save data!" });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFinancialYear();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
    },
    {
      title: "Name",
      dataIndex: "name",
      filters: [
        { text: "FY 2023", value: "FY 2023" },
        { text: "FY 2024", value: "FY 2024" },
      ],
      onFilter: (value, record) => record.name.includes(value),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Financial Year</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Master</Link>
              </li>
              <li className="breadcrumb-item active">Financial Year</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    ID*
                    <Input name="id" placeholder="ID" value={formData.id} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-6 p-1">
                    Start Date*
                    <Input name="startDate" placeholder="Start Date" value={formData.startDate} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-6 p-1">
                    End Date*
                    <Input name="endDate" placeholder="End Date" value={formData.endDate} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-6 p-1">
                    Name*
                    <Input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button type="primary" onClick={handleSubmit}>Save</Button>
                    <Button className="ms-1" danger>Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table columns={columns} dataSource={financialYear} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default FinancialYear;
>>>>>>> 33c62eed5d38742173d35a4787ca738cae8f49ea
