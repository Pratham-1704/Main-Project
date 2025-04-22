import React, { useState, useEffect } from "react";
import { Table, Input, Select, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const SBQ = () => {
  const [tableData, setTableData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [leadData, setLeadData] = useState([]);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brand");
      const options = Array.isArray(res.data.data)
        ? res.data.data.map((brand) => ({
            value: brand._id,
            label: brand.name,
          }))
        : [];
      setBrandOptions(options);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
      message.error("Failed to load brands");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8081/category");
      return res.data.data || [];
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      message.error("Failed to load categories");
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/product");
      return res.data.data || [];
    } catch (err) {
      console.error("Failed to fetch products:", err);
      message.error("Failed to load products");
      return [];
    }
  };

  // Fetch lead data and populate table
  const fetchLeadDataById = async (leadId) => {
    try {
      const categories = await fetchCategories();
      const products = await fetchProducts();

      const res = await axios.get(`http://localhost:8081/lead/${leadId}`);
      const itemsArray = Array.isArray(res.data.data?.items) ? res.data.data.items : [];

      if (itemsArray.length === 0) {
        message.warning("No items found for the given leadId");
        return;
      }

      const tableRows = itemsArray.map((item, index) => {
        const category = categories.find((cat) => cat._id === item.categoryid);
        const product = products.find((prod) => prod._id === item.productid);

        return {
          key: item._id || `row-${index}`,
          category: category ? category.name : "Unknown Category",
          product: product ? product.name : "Unknown Product",
          brand: null,
          req: item.quantity || "",
          estimationin: item.estimationin || "",
          rate: item.rate || "",
          total: (item.quantity || 0) * (item.rate || 0),
        };
      });

      setTableData(tableRows);
    } catch (err) {
      console.error("Failed to fetch lead data:", err);
      message.error("Failed to load lead data");
    }
  };

  // Load on mount
  useEffect(() => {
    fetchBrands();

    const storedLeadId = localStorage.getItem("selectedLeadId");
    if (!storedLeadId) {
      message.error("No leadId found in localStorage");
      return;
    }

    fetchLeadDataById(storedLeadId);
  }, []);

  const updateRow = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.key === key) {
          const updatedRow = { ...row, [field]: value };

          // Calculate total if 'req' or 'rate' is updated
          if (field === "req" || field === "rate") {
            const req = parseFloat(updatedRow.req) || 0;
            const rate = parseFloat(updatedRow.rate) || 0;
            updatedRow.total = req * rate;
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  const deleteRow = (key) => {
    setTableData((prev) => prev.filter((row) => row.key !== key));
  };

  // Calculate total sum of the "Total" column
  const calculateTotalSum = () => {
    return tableData.reduce((sum, row) => sum + (row.total || 0), 0);
  };

  const handleSave = async () => {
    try {
      // Save logic (you can replace this with the API call to save the data)
      const response = await axios.post("http://localhost:8081/svq", {
        data: tableData,
      });

      if (response.status === 200) {
        message.success("Data saved successfully!");
      } else {
        message.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Error saving data");
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (_, record) => (
        <Select
          placeholder="Select Brand"
          value={record.brand}
          onChange={(value) => {
            updateRow(record.key, "brand", value);

            if (value) {
              message.success("Brand selected");
            } else {
              message.warning("Brand deselected");
            }
          }}
          style={{ width: "100%" }}
          options={brandOptions}
        />
      ),
    },
    {
      title: "Req",
      dataIndex: "req",
      key: "req",
      render: (_, record) => (
        <Input
          value={record.req}
          onChange={(e) => updateRow(record.key, "req", e.target.value)}
        />
      ),
    },
    {
      title: "Unit",
      dataIndex: "estimationin",
      key: "estimationin",
      render: (_, record) => (
        <Input
          value={record.estimationin}
          onChange={(e) =>
            updateRow(record.key, "estimationin", e.target.value)
          }
        />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (_, record) => (
        <Input
          value={record.rate}
          onChange={(e) => updateRow(record.key, "rate", e.target.value)}
          disabled={!record.brand} // Disable rate if no brand is selected for that row
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => (
        <Input
          value={record.total}
          readOnly // Make the total field read-only
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>SBQ</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="">Lead</Link>
            </li>
            <li className="breadcrumb-item active">SBQ</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="card p-3 mt-3">
          <Table
            dataSource={tableData}
            columns={columns}
            rowKey="key"
            pagination={false}
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Total Sum: {calculateTotalSum()}
              </div>
            )}
          />
          <div className="text-end mt-2">
            <Link to="/lead/lead-record">
              <Button type="default" danger style={{ marginTop: "8px" }}>
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              style={{ marginLeft: "8px", marginTop: "8px" }}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SBQ;
