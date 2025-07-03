import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Table } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Css Files/style.css";

const { Option } = Select;

function ManageParity() {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const navigate = useNavigate();
  const { name, baseRate, parityId } = location.state || {};

  // Fetch brands
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/Brand");
        setBrands(response.data.status === "success" ? response.data.data : []);
      } catch (error) {
        message.error("Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/category");
        setCategories(response.data.status === "success" ? response.data.data : []);
      } catch (error) {
        message.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8081/product");
        setAllProducts(response.data.status === "success" ? response.data.data : []);
      } catch (error) {
        message.error("Failed to fetch products");
      }
    };
    fetchAllProducts();
  }, []);

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

      // For each row, find the product and its category
      const formattedData = filteredData.map((item, index) => {
        const prodId = item.productid?._id || item.productid;
        const prodObj = allProducts.find((p) => String(p._id) === String(prodId));
        const prodCatId = prodObj ? (prodObj.categoryid?._id || prodObj.categoryid) : null;
        const cat = prodCatId
          ? categories.find((c) => String(c._id) === String(prodCatId))
          : undefined;

        return {
          key: item._id,
          no: index + 1,
          brand: item.brandid?.name || "N/A",
          category: cat ? cat.name : "N/A",
          product: prodObj ? prodObj.name : (item.productid?.name || "N/A"),
          parity: item.parity || "",
          brandId: item.brandid?._id || item.brandid,
          productId: prodId,
        };
      });

      setTableData(formattedData);
    } catch (error) {
      message.error("Failed to fetch brandproduct records");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all brandproduct records initially and when products/categories change
  useEffect(() => {
    if (allProducts.length && categories.length) {
      fetchBrandProductRecords(selectedBrand, selectedCategory);
    }
    // eslint-disable-next-line
  }, [allProducts, categories, selectedBrand, selectedCategory, parityId]);

  // Handle brand selection
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    form.setFieldsValue({ brand: value });
    // fetchBrandProductRecords(value, selectedCategory); // Now handled by useEffect
  };

  // Handle category selection (if you enable category filter)
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    form.setFieldsValue({ category: value });
    // fetchBrandProductRecords(selectedBrand, value); // Now handled by useEffect
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const invalidRows = tableData.filter((item) => !item.brandId || !item.productId);
      if (invalidRows.length > 0) {
        message.error("Some rows are missing required fields: brandId or productId.");
        return;
      }

      const updates = tableData
        .filter((item) => item.parity && item.parity.trim() !== "")
        .map((item) => ({
          brandid: item.brandId,
          productid: item.productId,
          parity: item.parity,
          rate: Number(baseRate) + Number(item.parity),
          parityid: parityId,
        }));

      if (updates.length === 0) {
        message.warning("No records to update. Please enter parity values.");
        return;
      }

      const response = await axios.post("http://localhost:8081/brandproduct/update", { updates });

      if (response.data.status === "success") {
        messageApi.success("Brand products updated successfully!");
        // navigate("/parities");
      } else {
        message.error("Failed to update brand products");
      }
    } catch (error) {
      message.error("An error occurred while updating brand products");
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
    <>
      {contextHolder}
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
                        rules={[{ message: "Please select a brand" }]}
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
                      pagination ={{
                        pageSize: 10
                      }}
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
    </>
  );
}

export default ManageParity;
