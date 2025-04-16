import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Table,
  Input,
  Form,
  message,
  Space,
  InputNumber,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const BrandProduct = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [brandsRes, categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8081/brand"),
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
      ]);

      if (brandsRes.data.status === "success") setBrands(brandsRes.data.data);
      if (categoriesRes.data.status === "success")
        setCategories(categoriesRes.data.data);
      if (productsRes.data.status === "success")
        setProducts(productsRes.data.data);
    } catch (err) {
      messageApi.error("Failed to fetch initial data");
    }
  };

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        key: Date.now(),
        category: null,
        product: [],
        parity: "",
        rate: null,
        billingrate: null,
      },
    ]);
  };

  const handleRemoveRow = (key) => {
    setTableData(tableData.filter((row) => row.key !== key));
  };

  const handleChange = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.key === key ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = async () => {
    if (!selectedBrand) {
      messageApi.warning("Please select a brand before saving.");
      return;
    }

    const payload = tableData.flatMap((row) =>
      row.product.map((pid) => ({
        brandid: selectedBrand,
        productid: pid,
        parity: row.parity,
        rate: row.rate,
        billingrate: row.billingrate,
      }))
    );

    try {
      await axios.post("http://localhost:8081/brandproduct", payload);
      messageApi.success("Brand products saved successfully!");
      setTableData([]);
      setSelectedBrand(null);
    } catch (error) {
      messageApi.error("Failed to save brand products.");
    }
  };

  const handleCancel = () => {
    setSelectedBrand(null);
    setTableData([]);
  };

  const columns = [
    {
      title: "Sr. No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) => (
        <Select
          style={{ width: 150 }}
          value={record.category}
          onChange={(value) => handleChange(record.key, "category", value)}
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
      render: (_, record) => {
        const filteredProducts = products.filter(
          (p) => p.categoryid === record.category
        );
        return (
          <Select
            mode="multiple"
            style={{ width: 200 }}
            value={record.product}
            onChange={(value) => handleChange(record.key, "product", value)}
          >
            {filteredProducts.map((prod) => (
              <Option key={prod._id} value={prod._id}>
                {prod.name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Parity",
      dataIndex: "parity",
      render: (_, record) => (
        <Input
          value={record.parity}
          onChange={(e) => handleChange(record.key, "parity", e.target.value)}
        />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (_, record) => (
        <InputNumber
          value={record.rate}
          onChange={(value) => handleChange(record.key, "rate", value)}
        />
      ),
    },
    {
      title: "Billing Rate",
      dataIndex: "billingrate",
      render: (_, record) => (
        <InputNumber
          value={record.billingrate}
          onChange={(value) =>
            handleChange(record.key, "billingrate", value)
          }
        />
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          icon={<MinusCircleOutlined />}
          danger
          onClick={() => handleRemoveRow(record.key)}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Brand-Product</h1>
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
          <div className="card p-3 custom-table">
            <Space style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Brand"
                value={selectedBrand}
                style={{ width: 200 }}
                onChange={setSelectedBrand}
              >
                {brands.map((b) => (
                  <Option key={b._id} value={b._id}>
                    {b.name}
                  </Option>
                ))}
              </Select>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRow}
                disabled={!selectedBrand}
              >
                Add Row
              </Button>
            </Space>

            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="key"
              pagination={false}
            />
          </div>

          <div className="card p-3 custom-table">
            <Space>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </div>
        </section>
      </main>
    </>
  );
};

export default BrandProduct;
