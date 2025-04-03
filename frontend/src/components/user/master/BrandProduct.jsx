import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, message, Table } from "antd";
import axios from "axios";
import "./Css Files/style.css";

function BrandProducts() {
  const [formData, setFormData] = useState({
    brandid: "",
    productid: "",
    parity: "",
    rate: "",
    billingrate: "",
  });

  const [brandProducts, setBrandProducts] = useState([]);
  const [brands, setBrands] = useState([]); // Store brand data
  const [products, setProducts] = useState([]); // Store product data
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch brand products
  const fetchBrandProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brandproduct");
      setBrandProducts(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brand products:", error);
      setBrandProducts([]);
    }
  };

  // Fetch brands for the dropdown
  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      setBrands(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  // Fetch products for the dropdown
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/product");
      setProducts(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchBrandProducts();
    fetchBrands();
    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (CREATE)
  const handleSubmit = async () => {
    if (!formData.brandid || !formData.productid || !formData.parity || !formData.rate || !formData.billingrate) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }
    try {
      await axios.post("http://localhost:8081/brandProduct", formData);
      messageApi.open({ type: "success", content: "Brand product saved successfully!" });
      fetchBrandProducts();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save brand product!" });
      console.error("Error:", error);
    }
  };

  // Handle update (UPDATE)
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a brand product to update!" });
      return;
    }

    try {
      await axios.put(`http://localhost:8081/brandProduct/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Brand product updated successfully!" });
      fetchBrandProducts();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update brand product!" });
      console.error("Error:", error);
    }
  };

  // Handle delete (DELETE)
  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a brand product to delete!" });
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/brandProduct/${formData._id}`);
      messageApi.open({ type: "success", content: "Brand product deleted successfully!" });
      fetchBrandProducts();
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete brand product!" });
      console.error("Error:", error);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      brandid: "",
      productid: "",
      parity: "",
      rate: "",
      billingrate: "",
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: "Brand",
      dataIndex: "brandid",
      key: "brandid",
      render: (brandid) => {
        const brand = brands.find((b) => b._id === brandid);
        return brand ? brand.name : "Unknown";
      },
    },
    {
      title: "Product",
      dataIndex: "productid",
      key: "productid",
      render: (productid) => {
        const product = products.find((p) => p._id === productid);
        return product ? product.name : "Unknown";
      },
    },
    { title: "Parity", dataIndex: "parity", key: "parity" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Billing Rate", dataIndex: "billingrate", key: "billingrate" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Brand Products Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={"/"}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Brand Products</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Brand*
                    <Select
                      className="w-100"
                      placeholder="Select Brand"
                      value={formData.brandid} // Use brandid from formData
                      onChange={(value) => handleSelectChange("brandid", value)}
                      options={brands.map((brand) => ({
                        value: brand._id,
                        label: brand.name,
                      }))}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Product*
                    <Select
                      className="w-100"
                      placeholder="Select Product"
                      value={formData.productid}
                      onChange={(value) => handleSelectChange("productid", value)}
                      options={products.map((product) => ({
                        value: product._id,
                        label: product.name,
                      }))}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Parity*
                    <Input name="parity" placeholder="Parity" value={formData.parity} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-6 p-1">
                    Rate*
                    <Input name="rate" placeholder="Rate" value={formData.rate} onChange={handleInputChange} />
                  </div>
                  <div className="col-lg-6 p-1">
                    Billing Rate*
                    <Input name="billingrate" placeholder="Billing Rate" value={formData.billingrate} onChange={handleInputChange} />
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
                      color="green" variant="solid"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>

                    <Button
                      color="danger" variant="solid"
                      onClick={handleDelete}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="solid"
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
                  dataSource={brandProducts}
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

export default BrandProducts;
