import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Table } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Css Files/style.css"; // Import the CSS file

const { Option } = Select;

function ManageParity() {
  const [form] = Form.useForm(); // Form instance
  const [brands, setBrands] = useState([]); // Brands for dropdown
  const [categories, setCategories] = useState([]); // Categories for dropdown
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]); // Table data
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { name, baseRate,parityId } = location.state || {}; // Get parity name and base rate from parities.jsx
console.log("Location state:", location.state); // 
  // Fetch brandproduct records for the table
  const fetchBrandProductRecords = async (brandId = "", categoryId = "") => {
    setLoading(true);
    try {
      const queryParams = [];
      if (brandId) queryParams.push(`brandid=${brandId}`);
      if (categoryId) queryParams.push(`categoryid=${categoryId}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  
      const response = await axios.get(`http://localhost:8081/brandproduct${queryString}`);
      const fetchedData = response.data.status === "success" ? response.data.data : [];
  
      const filteredData = fetchedData.filter(
        (item) => item.parityid === parityId || item.parityid === null
      );
  
      // Get selected category name
      const selectedCatObj = categories.find((cat) => cat._id === categoryId);
      const selectedCatName = selectedCatObj ? selectedCatObj.name : "N/A";
  
      const formattedData = filteredData.map((item, index) => ({
        key: item._id,
        no: index + 1,
        brand: item.brandid?.name || "N/A",
        category: selectedCatName || item.categoryid?.name || "N/A", // Prefer selected
        product: item.productid?.name || "N/A",
        parity: item.parity || "",
        brandId: item.brandid?._id || item.brandid,
        productId: item.productid?._id || item.productid,
      }));
  
      setTableData(formattedData);
    } catch (error) {
      message.error("Failed to fetch brandproduct records");
      console.error("Error fetching brandproduct records:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle brand selection
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    form.setFieldsValue({ brand: value });
    fetchBrandProductRecords(value, selectedCategory); // Now filters both
  };
  

  // Add this function to handle category selection
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({ category: value });
    fetchBrandProductRecords(selectedBrand, value); // Now filters both brand and category
  };
  
  

  // Fetch brands for the dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/brand");
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

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/category");
        const fetchedCategories = response.data.status === "success" ? response.data.data : [];
        setCategories(fetchedCategories);
      } catch (error) {
        message.error("Failed to fetch categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all brandproduct records initially
  useEffect(() => {
    fetchBrandProductRecords(); // Fetch all records initially
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate tableData
      const invalidRows = tableData.filter((item) => !item.brandId || !item.productId);
      if (invalidRows.length > 0) {
        message.error("Some rows are missing required fields: brandId or productId.");
        return;
      }

      // Filter rows with a non-empty parity value
      const updates = tableData
        .filter((item) => item.parity && item.parity.trim() !== "") // Only include rows with a parity value
        .map((item) => ({
          brandid: item.brandId, // Brand ID from the table row
          productid: item.productId, // Product ID from the table row
          parity: item.parity, // Parity value entered in the table
          rate: baseRate + Number(item.parity), // Calculate rate as baseRate + parity value
          parityid: parityId, // Parity ID from the state
        }));

      if (updates.length === 0) {
        message.warning("No records to update. Please enter parity values.");
        return;
      }

      // Send the data to the backend
      const response = await axios.post("http://localhost:8081/brandproduct/update", { updates });

      if (response.data.status === "success") {
        message.success("Brand products updated successfully!");
        // navigate("/parities"); // Navigate to the Parities Page
      } else {
        message.error("Failed to update brand products");
      }
    } catch (error) {
      message.error("An error occurred while updating brand products");
      console.error("Error updating brand products:", error);
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
    { title: "Category", dataIndex: "category", key: "category" },
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
          style={{ width: "100px" }}
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
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  name: name || "",
                  baseRate: baseRate || "",
                }}
              >
                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <Form.Item
                      label="Parity Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter the parity name" }]}
                    >
                      <Input placeholder="Enter parity name" disabled />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <Form.Item
                      label="Base Rate"
                      name="baseRate"
                      rules={[{ required: true, message: "Please enter the base rate" }]}
                    >
                      <Input placeholder="Enter base rate" type="number" disabled />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <Form.Item
                      label="Brand"
                      name="brand"
                      rules={[{  message: "Please select a brand" }]}
                    >
                      <Select
                        placeholder="Select a brand"
                        onChange={handleBrandChange}
                        value={selectedBrand}
                        loading={loading}
                      >
                        {brands.map((brand) => (
                          <Option key={brand._id} value={brand._id}>
                            {brand.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  {/* <div className="col-lg-6 mb-3">
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: "Please select a category" }]}
                    >
                      <Select
                        placeholder="Select a category"
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        loading={loading}
                      >
                        {categories.map((category) => (
                          <Option key={category._id} value={category._id}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div> */}
                </div>

                <div className="col-lg-12 mb-3">
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    rowKey="key"
                    pagination={{ pageSize: 10 }}
                  />
                </div>

                <div className="col-lg-12 mb-3 text-center">
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Save
                  </Button>
                  <Button
                    type="default"
                    onClick={() => navigate(-1)}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManageParity;
