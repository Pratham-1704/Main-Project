import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Table, Flex } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Import the CSS file

const { Option } = Select;

function ManageParity() {
  const [brands, setBrands] = useState([]); // State to hold brand options
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [tableData, setTableData] = useState([]); // State to hold table data

  // Fetch brands for the dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/brand"); // Replace with your API endpoint
        const fetchedBrands = response.data.status === "success" ? response.data.data : [];
        setBrands(fetchedBrands);
      } catch (error) {
        message.error("Failed to fetch brands");
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/parities"); // Replace with your API endpoint
        const fetchedData = response.data.status === "success" ? response.data.data : [];
        const formattedData = fetchedData.map((item, index) => ({
          key: item._id,
          no: index + 1,
          brand: item.brandid?.name || "N/A",
          product: item.productid?.name || "N/A",
          parity: item.parity || "N/A",
        }));
        setTableData(formattedData);
      } catch (error) {
        message.error("Failed to fetch table data");
        console.error("Error fetching table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:8081/manageparity", values); // Replace with your API endpoint
      if (response.data.status === "success") {
        message.success("Parity details saved successfully!");
      } else {
        message.error("Failed to save parity details");
      }
    } catch (error) {
      message.error("An error occurred while saving parity details");
      console.error("Error saving parity details:", error);
    }
  };

  // Table columns
  const columns = [
    { title: "No", dataIndex: "no", key: "no", align: "center" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Parity", dataIndex: "parity", key: "parity" },
  ];

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Manage Parity</h1>
      </div>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card p-3 custom-table">
              <Form
                layout="horizontal"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSubmit}
              >
                {/* Parities Input */}
                <div className="col-lg-12 mb-0">
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <Form.Item
                        label="Parities"
                        name="parity"
                        rules={[{ required: true, message: "Please enter parities" }]}
                      >
                        <Input placeholder="Enter parities" className="ant-input" />
                      </Form.Item>
                    </div>
                    <div className="col-lg-6 mb-3">
                      {/* Base Rate Input */}
                      <Form.Item
                        label="Base Rate"
                        name="baseRate"
                        rules={[{ required: true, message: "Please enter base rate" }]}
                      >
                        <Input placeholder="Enter base rate" type="number" className="ant-input" />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
                    {/* Brand Dropdown */}
                    <Form.Item
                      label="Brand"
                      name="brand"
                      rules={[{ required: true, message: "Please select a brand" }]}
                    >
                      <Select placeholder="Select a brand" loading={loading} className="ant-select-selector">
                        {brands.map((brand) => (
                          <Option key={brand._id} value={brand._id}>
                            {brand.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                {/* Table */}
                <div className="col-lg-12 mb-3">
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    rowKey="key"
                    pagination={{ pageSize: 5 }}
                    className="custom-table"
                  />
                </div>

                {/* Submit Button */}
                <Form.Item >
                  <div >
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{ marginLeft: '930px' }}
                      className="ant-btn"
                    >
                      Save
                    </Button>
                  </div>

                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManageParity;