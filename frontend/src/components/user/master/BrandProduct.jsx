import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Select, Input, Form, message, Checkbox } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Reuse the same CSS file as in Brand.jsx

const { Option } = Select;

const BrandProduct = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const brandName = location.state?.brandName; // Retrieve the brand name from state

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
      ]);

      console.log("Categories:", categoriesRes.data.data);
      console.log("Products:", productsRes.data.data);

      setCategories(categoriesRes.data.data || []);
      setProducts(productsRes.data.data || []);
      setFilteredProducts(productsRes.data.data || []);
    } catch (err) {
      message.error("Failed to fetch initial data.");
    }
  };

  const handleCategoryChange = (value) => {
    setFilteredProducts(
      value
        ? products.filter((prod) => prod.categoryid === value)
        : products
    );
  };

  const handleSearch = () => {
    setFilteredProducts(
      products.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!form.getFieldValue("category") ||
            prod.categoryid === form.getFieldValue("category"))
      )
    );
  };

  const handleCheckboxChange = (productId, checked) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:8081/brandproduct", {
        brand: brandName,
        products: selectedProducts,
      });
      message.success("Products saved successfully!");
    } catch (err) {
      message.error("Failed to save products.");
    }
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Manage Brand Products</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brand-Product</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6">
                  <Form.Item label="Brand">
                    <Input value={brandName} disabled />
                  </Form.Item>
                </div>
                <div className="col-lg-6">
                  <Form.Item name="category" label="Category">
                    <Select
                      placeholder="Select Category"
                      onChange={handleCategoryChange}
                      allowClear
                    >
                      {categories.map((cat) => (
                        <Option key={cat._id} value={cat._id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>

          <div className="card p-3 mt-3">
            <div className="row mb-3">
              <div className="col-lg-10">
                <Input
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-lg-2">
                <Button type="primary" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            <div>
              {filteredProducts.map((prod) => (
                <div
                  key={prod._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Checkbox
                    checked={selectedProducts.includes(prod._id)}
                    onChange={(e) =>
                      handleCheckboxChange(prod._id, e.target.checked)
                    }
                  >
                    {prod.name}
                  </Checkbox>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BrandProduct;
