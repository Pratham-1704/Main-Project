import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  message,
  Form,
  DatePicker,
  Row,
  Col,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const SBQ = () => {
  const [tableData, setTableData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [form] = Form.useForm();
  const [brandProductData, setBrandProductData] = useState([]);

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

  const fetchBrandProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brandproduct");
      console.log("BrandProduct Data:", res.data.data); // Debugging
      setBrandProductData(res.data.data || []); // Store brandproduct data
    } catch (err) {
      console.error("Failed to fetch brand products:", err);
      message.error("Failed to load brand products");
    }
  };

  const fetchLeadDataById = async (leadId) => {
    try {
      const categories = await fetchCategories();
      const products = await fetchProducts();

      const res = await axios.get(`http://localhost:8081/lead/${leadId}`);
      const leadData = res.data.data;

      console.log("Lead Data:", leadData); // Debugging: Check the structure of the lead data

      // Fetch customer details if needed
      let customerDetails = {};
      if (leadData.customerid) {
        const customerRes = await axios.get(
          `http://localhost:8081/customer/${leadData.customerid}`
        );
        customerDetails = customerRes.data.data || {};
      }

      // Fetch source details if needed
      let sourceDetails = {};
      if (leadData.sourceid) {
        const sourceRes = await axios.get(
          `http://localhost:8081/source/${leadData.sourceid}`
        );
        sourceDetails = sourceRes.data.data || {};
      }

      // Map API response keys to form field names
      form.setFieldsValue({
        name: customerDetails.name || "", // Customer name from customer API
        mobile: customerDetails.mobileno1 || "", // Mobile from customer API
        city: customerDetails.city || "", // City from customer API
        state: customerDetails.state || "", // State from customer API
        address: customerDetails.address || "", // Address from customer API
        source: sourceDetails.name || "", // Source name from source API
        leaddate: leadData.leaddate ? dayjs(leadData.leaddate) : null, // Lead date
      });

      const itemsArray = Array.isArray(leadData?.items) ? leadData.items : [];

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
          productid: product ? product._id : null, // Include productid
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

  const fetchRate = async (brandid, productid) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/brandproduct/getRate",
        {
          params: { brandid, productid },
        }
      );
      return response.data.rate || 0; // Return the rate or default to 0
    } catch (error) {
      console.error("Failed to fetch rate:", error);
      return 0; // Default rate in case of error
    }
  };

  const updateRow = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.key === key) {
          const updatedRow = { ...row, [field]: value };

          // If brand is updated, fetch the rate
          if (field === "brand") {
            console.log("Selected Brand ID:", value);
            console.log("Product ID:", row.productid);

            fetchRate(value, row.productid).then((rate) => {
              updatedRow.rate = rate || 0; // Update rate dynamically
              updatedRow.total = (updatedRow.req || 0) * updatedRow.rate; // Recalculate total
              setTableData((prev) =>
                prev.map((r) => (r.key === key ? updatedRow : r))
              );
            });
          }

          // If req or rate is updated, recalculate total
          if (field === "req" || field === "rate") {
            const req = parseFloat(field === "req" ? value : updatedRow.req) || 0;
            const rate = parseFloat(field === "rate" ? value : updatedRow.rate) || 0;
            updatedRow.total = req * rate; // Recalculate total
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  useEffect(() => {
    fetchBrands();
    fetchBrandProducts(); // Fetch brandproduct data

    const storedLeadId = localStorage.getItem("selectedLeadId");
    if (!storedLeadId) {
      message.error("No leadId found in localStorage");
      return;
    }

    fetchLeadDataById(storedLeadId);
  }, []);

  const deleteRow = (key) => {
    setTableData((prev) => prev.filter((row) => row.key !== key));
  };

  const calculateTotalSum = () => {
    return tableData.reduce((sum, row) => sum + (row.total || 0), 0);
  };

  const handleSave = async () => {
    try {
      const formData = await form.validateFields();
      const response = await axios.post("http://localhost:8081/svq", {
        form: formData,
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

  const handleUpdate = async () => {
    try {
      const formData = await form.validateFields();
      const response = await axios.put("http://localhost:8081/svq", {
        form: formData,
        data: tableData,
      });

      if (response.status === 200) {
        message.success("Data updated successfully!");
      } else {
        message.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      message.error("Error updating data");
    }
  };

  const formFields = (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Customer Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter Name" readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Mobile" name="mobile" rules={[{ required: true }]}>
            <Input placeholder="Enter Mobile" readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="City" name="city">
            <Input placeholder="Enter City" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="State" name="state">
            <Input placeholder="Enter State" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Address" name="address">
            <Input placeholder="Enter Address" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Source" name="source">
            <Input placeholder="Enter Source" readOnly />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Lead Date" name="leaddate">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-end">
        <Button type="primary" onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </Form>
  );

  const commonColumns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text) => <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (_, record) => (
        <Select
          placeholder="Select Brand"
          value={record.brand}
          onChange={(value) => updateRow(record.key, "brand", value)}
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
        <Select
          placeholder="Select Unit"
          value={record.estimationin}
          onChange={(value) => updateRow(record.key, "estimationin", value)}
          style={{ width: "100%" }}
          options={[
            { value: "Kg", label: "Kg" },
            { value: "Meter", label: "Meter" },
            { value: "Feet", label: "Feet" },
            { value: "No's", label: "No's" },
          ]}
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
          placeholder="Enter Rate"
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => <Input value={record.total} readOnly />,
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
          {formFields}
        </div>

        <div className="card p-3 mt-3">
          <Table
            dataSource={tableData}
            columns={[
              {
                title: "Category",
                dataIndex: "category",
                key: "category",
                render: (text) => (
                  <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                ),
              },
              ...commonColumns,
            ]}
            rowKey="key"
            pagination={false}
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Total Sum: {calculateTotalSum()}
              </div>
            )}
          />
          <div className="text-end mt-2">
            <Button
              type="primary"
              style={{ marginRight: "8px", marginTop: "8px" }}
              onClick={handleSave}
            >
              Save
            </Button>

            <Link to="/lead/lead-record">
              <Button type="default" danger style={{ marginTop: "8px" }}>
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SBQ;