import { Button, Input, message, Table } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

function Brand() {
  const [formData, setFormData] = useState({
    name: "",
    srno: "",
  });

  const [brands, setBrands] = useState([]); // State to store fetched brands
  const [messageApi, contextHolder] = message.useMessage(); // Initialize message API

  // Fetch brands from the backend
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      if (response.data.status === "success") {
        setBrands(response.data.data || []);
      } else {
        throw new Error("Failed to fetch brands from the server.");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      messageApi.open({
        type: "error",
        content: "Unable to load brand data. Please check your network connection or try again later.",
      });
      setBrands([]); // Fallback to empty array to avoid errors
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Client-side validation
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]+$/; // Regex to allow only letters and spaces

    if (!formData.name.trim()) {
      messageApi.open({
        type: "error",
        content: "Please enter a valid name.",
      });
      return false;
    }
    if (!nameRegex.test(formData.name)) {
      messageApi.open({
        type: "error",
        content: "The 'Name' field must contain only letters and spaces.",
      });
      return false;
    }
    if (formData.name.length < 3) {
      messageApi.open({
        type: "error",
        content: "The 'Name' must be at least 3 characters long.",
      });
      return false;
    }
    if (formData.name.length > 100) {
      messageApi.open({
        type: "error",
        content: "The 'Name' should not exceed 100 characters.",
      });
      return false;
    }

    if (!formData.srno.trim()) {
      messageApi.open({
        type: "error",
        content: "Please enter a valid serial number.",
      });
      return false;
    }

    const srnoRegex = /^[1-9][0-9]*$/; // Regex to ensure it's a positive integer (1 or greater)
    if (!srnoRegex.test(formData.srno)) {
      messageApi.open({
        type: "error",
        content: "The 'Serial Number' must be a positive integer greater than zero.",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const existingResponse = await axios.get(
        `http://localhost:8081/brand?name=${formData.name}&srno=${formData.srno}`
      );
      if (existingResponse.data.exists) {
        messageApi.open({
          type: "error",
          content: "A brand with the same 'Name' or 'Serial Number' already exists. Please use unique values.",
        });
        return;
      }

      const response = await axios.post("http://localhost:8081/brand", formData);
      if (response.status === 201 || response.status === 200) {
        messageApi.open({
          type: "success",
          content: "Data saved successfully!",
        });
        setFormData({ name: "", srno: "" }); // Reset form fields
        fetchBrands(); // Refresh table data
      } else {
        throw new Error("Failed to save brand data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      messageApi.open({
        type: "error",
        content: "Serial Number already exists.",
      });
    }
  };

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Sr No", dataIndex: "srno", key: "srno" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Brand</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/dashboard"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brand</li>
            </ol>
          </nav>
        </div>
        <section>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="col-lg-6 p-1">
                  Name*
                  <Input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6 p-1">
                  Sr No*
                  <Input
                    name="srno"
                    placeholder="Serial Number"
                    value={formData.srno}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table columns={columns} dataSource={brands} rowKey="_id" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Brand;
