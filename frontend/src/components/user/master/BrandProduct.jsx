import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Select,
  Table,
  Input,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveFilled, SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css"; // Reuse the same CSS file as in Brand.jsx

const { Option } = Select;

const BrandProduct = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const brandName = location.state?.brandName; // Retrieve the brand name from state

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch categories and products from the backend
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
      ]);

      setCategories(categoriesRes.data.data || []);
      setProducts(productsRes.data.data || []);
    } catch (err) {
      messageApi.error("Failed to fetch initial data.");
    }
  };

  const handleCategoryChange = (value) => {
    // Add a new row with the selected category
    setTableData((prev) => [
      ...prev,
      {
        key: Date.now(),
        category: value, // Set the selected category
        product: null, // Initialize product as null
        isCategoryDisabled: true, // Disable the category dropdown for this row
      },
    ]);

    // Clear the category field in the form
    form.resetFields(["category"]);
  };

  const handleRemoveRow = (key) => {
    setTableData((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSave = () => {
    form.validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        console.log("Table Data:", tableData);
        messageApi.success("Data saved successfully!");
      })
      .catch((err) => {
        messageApi.error("Please fill in all required fields.");
      });
  };

  const columns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <Select
          placeholder="Select Category"
          value={record.category}
          onChange={(value) =>
            setTableData((prev) =>
              prev.map((row) =>
                row.key === record.key
                  ? { ...row, category: value, product: null }
                  : row
              )
            )
          }
          style={{ width: "100%" }}
          disabled={record.isCategoryDisabled} // Disable if the category is already selected
        >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Products",
      dataIndex: "product",
      key: "product",
      width: 300, // Set a fixed width for the column
      render: (text, record) => (
        <Select
          mode="multiple" // Enable multi-selection
          placeholder="Select Products"
          value={record.product}
          onChange={(value) =>
            setTableData((prev) =>
              prev.map((row) =>
                row.key === record.key ? { ...row, product: value } : row
              )
            )
          }
          style={{ width: "100%" }}
          disabled={!record.category} // Disable if no category is selected
        >
          {products
            .filter((prod) => prod.categoryid === record.category)
            .map((prod) => (
              <Option key={prod._id} value={prod._id}>
                {prod.name}
              </Option>
            ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<SaveOutlined />}
            // onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this customer?"
            // onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Manage Products</h1>
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
          <div className="card p-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item label="Brand">
                    <Input value={brandName} disabled />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item name="category" label="Category">
                    <Select
                      placeholder="Select Category"
                      style={{ width: "100%" }}
                      onChange={handleCategoryChange} // Add a new row when a category is selected
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

          <div className="card p-3 custom-table mt-3">
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="key"
              pagination={false}
              bordered
            />
            <div style={{ marginTop: 10, textAlign: "right" }}>
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
