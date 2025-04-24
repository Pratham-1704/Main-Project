import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Table } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Css Files/style.css"; // Import the CSS file

const { Option } = Select;

function ManageParity() {
  const [brands, setBrands] = useState([]); // State to hold brand options
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [tableData, setTableData] = useState([]); // State to hold table data
  const [parity, setParity] = useState(""); // State for parity
  const [baseRate, setBaseRate] = useState(""); // State for base rate
  const [selectedBrand, setSelectedBrand] = useState(""); // State for selected brand

  const location = useLocation();
  const { brandId, productId } = location.state || {}; // Retrieve brand and product IDs from state

  // Fetch parity and base rate from the brandproduct table
  useEffect(() => {
    const fetchParityAndRate = async () => {
      if (!brandId || !productId) {
        message.error("Brand or Product information is missing!");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8081/brandproduct?brandId=${brandId}&productId=${productId}`
        );
        console.log("API Response:", response.data); // Debugging log

        if (response.data.status === "success" && response.data.data.length > 0) {
          const { parity, rate } = response.data.data[0];
          console.log("Fetched Parity:", parity); // Debugging log
          console.log("Fetched Base Rate:", rate); // Debugging log
          // setParity(parity || "0");
          // setBaseRate(rate || "0");
          fetchTableData(parity); // Fetch table data based on parity
        } else {
          message.warning("No parity or rate data found for the selected brand and product.");
        }
      } catch (error) {
        message.error("Failed to fetch parity and rate data.");
        console.error("Error fetching parity and rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParityAndRate();
  }, [brandId, productId]);

  // Fetch table data based on parity
  const fetchTableData = async (parity) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/brandproduct?parity=${parity}`); // Replace with your API endpoint
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

  // Handle brand selection
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

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

  // Handle parity input change in the table
  const handleParityChange = (value, record) => {
    const updatedTableData = tableData.map((item) =>
      item.key === record.key ? { ...item, parity: value } : item
    );
    setTableData(updatedTableData);
  };

  // Table columns
  const columns = [
    { title: "No", dataIndex: "no", key: "no", align: "center" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Product", dataIndex: "product", key: "product" },
    {
      title: "Parity",
      dataIndex: "parity",
      key: "parity",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleParityChange(e.target.value, record)}
          placeholder="Enter parity"
          style={{ width: "100px" }} // Adjust the width of the input
        />
      ),
    },
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
                        initialValue={parity}
                        rules={[{ required: true, message: "Please enter parities" }]}
                      >
                        <Input
                          placeholder="Enter parities"
                          className="ant-input"
                          value={parity}
                          onChange={(e) => setParity(e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-lg-6 mb-3">
                      {/* Base Rate Input */}
                      <Form.Item
                        label="Base Rate"
                        name="baseRate"
                        initialValue={baseRate}
                        rules={[{ required: true, message: "Please enter base rate" }]}
                      >
                        <Input
                          placeholder="Enter base rate"
                          type="number"
                          className="ant-input"
                          value={baseRate}
                          onChange={(e) => setBaseRate(e.target.value)}
                        />
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
                      <Select
                        placeholder="Select a brand"
                        onChange={handleBrandChange}
                        value={selectedBrand}
                        loading={loading}
                        className="ant-select-selector"
                      >
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
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                  <Button type="primary" htmlType="submit" loading={loading} className="ant-btn">
                    Save
                  </Button>
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