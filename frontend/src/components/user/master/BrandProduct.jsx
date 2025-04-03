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
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchBrandProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brandproduct");
      setBrandProducts(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brand products:", error);
      setBrandProducts([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("http://localhost:8081/brand");
      setBrands(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    {
      title: "Brand Name",
      dataIndex: "brandid",
      key: "brandid",
      render: (brandid) => brands.find((b) => b._id === brandid)?.name || "Unknown",
    },
    {
      title: "Product Name",
      dataIndex: "productid",
      key: "productid",
      render: (productid) => products.find((p) => p._id === productid)?.name || "Unknown",
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
                      value={formData.brandid}
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
                      setFormData(record);
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