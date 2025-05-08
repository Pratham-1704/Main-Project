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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();
  const brandName = location.state?.brandName;
  const brandId = location.state?.brandId;

  const [messageApi, contextHolder] = message.useMessage(); // Use messageApi for displaying messages

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!brandId) {
      messageApi.error("Brand ID is missing!");
      return;
    }
    setProducts([]);
    fetchInitialData();
    fetchSelectedProducts();
  }, [brandId]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      let matchesCategory = true;
      if(selectedCategory != "none") {
        matchesCategory = selectedCategory ? product.categoryid === selectedCategory : true;
      }
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearchTerm;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);


  const fetchInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8081/category")
      ]);
      setCategories([{ _id: "none", name: "None" }, ...categoriesRes.data.data]);
    } catch (err) {
      console.error("Error fetching initial data:", err);
      messageApi.error("Failed to fetch initial data.");
    }
  };

  const fetchSelectedProducts = async () => {
    try {
      // Fetch the list of selected products for the current brand
      console.log(`http://localhost:8081/brandproduct/productids/${brandId}`);
      const response = await axios.get(`http://localhost:8081/brandproduct/productids/${brandId}`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching selected products:", err.response?.data || err.message);
      messageApi.error("Failed to fetch associated products.");
    }
  };

  const handleCheckboxChange = async (productId, checked) => {
    try {
      if (checked) {
        // Payload for adding a product
        const payload = {
          brandid: brandId, // Brand ID
          productid: productId, // Product ID
          parityid: null, // Set parityid as null
          parity: "", // Set parity as empty
          rate: 0, // Set rate as 0
        };
        // API call to add the product to the brandproduct table
        await axios.post("http://localhost:8081/brandproduct", payload);
        messageApi.success("Product added successfully!");
      } else {
        // API call to remove the product from the brandproduct table
        const deleteUrl = `http://localhost:8081/brandproduct?brandId=${brandId}&productId=${productId}`;
        await axios.delete(deleteUrl);
        messageApi.success("Product removed successfully!");
      }
      setProducts(products.map((product) =>
        product._id === productId
          ? { ...product, added: checked }
          : product
      ));
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
          checked={record.added} // Check if the product is in the selected list
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
                  onChange={(setCategory) => setSelectedCategory(setCategory)}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
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


