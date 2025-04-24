import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Table, Select, Input, message, Checkbox } from "antd";
import axios from "axios";
import "./Css Files/style.css";

const { Option } = Select;

const BrandProduct = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();
  const brandName = location.state?.brandName;
  const brandId = location.state?.brandId;

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!brandId) {
      message.error("Brand ID is missing!");
      return;
    }

    fetchInitialData();
    fetchSelectedProducts();
  }, [brandId]);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
      ]);

      setCategories([{ _id: "none", name: "None" }, ...categoriesRes.data.data]);
      setProducts(productsRes.data.data || []);
      setFilteredProducts(productsRes.data.data || []);
    } catch (err) {
      message.error("Failed to fetch initial data.");
    }
  };

  const fetchSelectedProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/brandproduct?brandId=${brandId}`);
      const associatedProductIds = response.data.data.map((item) => item.productid);
      // Update localStorage with the selected products
      localStorage.setItem(`selectedProducts_${brandId}`, JSON.stringify(associatedProductIds));
      setSelectedProducts(associatedProductIds);
    } catch (err) {
      console.error("Error fetching selected products:", err.response?.data || err.message);
      message.error("Failed to fetch associated products.");
    }
  };

  // On page load, fetch selected products from localStorage
  useEffect(() => {
    const storedSelectedProducts = JSON.parse(localStorage.getItem(`selectedProducts_${brandId}`));
    if (storedSelectedProducts) {
      setSelectedProducts(storedSelectedProducts);
    }
  }, [brandId]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFilteredProducts(
      value === "none"
        ? products
        : products.filter((prod) => prod.categoryid === value)
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilteredProducts(
      products.filter(
        (prod) =>
          prod.name.toLowerCase().includes(value.toLowerCase()) &&
          (!selectedCategory || selectedCategory === "none" || prod.categoryid === selectedCategory)
      )
    );
  };

  const handleCheckboxChange = async (productId, checked) => {
    try {
      if (checked) {
        const payload = {
          brandid: brandId,
          productid: productId,
          parityid: "none",
          parity: "0",
          rate: 0,
          billingrate: 0,
        };

        await axios.post("http://localhost:8081/brandproduct", payload);
        setSelectedProducts((prev) => {
          const updatedSelectedProducts = [...prev, productId];
          localStorage.setItem(`selectedProducts_${brandId}`, JSON.stringify(updatedSelectedProducts)); // Save to localStorage
          return updatedSelectedProducts;
        });
        messageApi.success("Product added successfully!");
      } else {
        const deleteUrl = `http://localhost:8081/brandproduct?brandId=${brandId}&productId=${productId}`;
        await axios.delete(deleteUrl);
        setSelectedProducts((prev) => {
          const updatedSelectedProducts = prev.filter((id) => id !== productId);
          localStorage.setItem(`selectedProducts_${brandId}`, JSON.stringify(updatedSelectedProducts)); // Save to localStorage
          return updatedSelectedProducts;
        });
        messageApi.success("Product removed successfully!");
      }
    } catch (err) {
      console.error("Error updating product selection:", err.response?.data || err.message);
      messageApi.error("Error updating product selection.");
    }
  };

  const columns = [
    {
      title: "Checkbox",
      key: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedProducts.includes(record._id)} // Check if the product is in the selected list
          onChange={(e) => handleCheckboxChange(record._id, e.target.checked)}
        />
      ),
    },
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "categoryid",
      key: "categoryid",
      render: (categoryid) => {
        const category = categories.find((cat) => cat._id === categoryid);
        return category ? category.name : "Unknown";
      },
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <>
      {contextHolder}
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
            <div className="row mb-3">
              <div className="col-lg-6">
                <label>Brand Name</label>
                <Input value={brandName} readOnly style={{ backgroundColor: "#f5f5f5" }} />
              </div>
              <div className="col-lg-6">
                <label>Category</label>
                <Select
                  placeholder="Select Category"
                  onChange={handleCategoryChange}
                  allowClear
                  style={{ width: "100%" }}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-lg-12">
                <Input
                  placeholder="Search Products"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="card p-3 mt-3">
            <Table
              columns={columns}
              dataSource={filteredProducts}
              rowKey="_id"
              pagination={false} // removed pagination
            />
          </div>
        </section>
      </main>
    </>
  );
};


export default BrandProduct;