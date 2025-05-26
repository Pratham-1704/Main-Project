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
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const MBQ = () => {
  const { quotationid } = useParams();
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brandProductData, setBrandProductData] = useState([]);
  const navigate = useNavigate();

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
      message.error("Failed to load brands");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8081/category");
      setCategories(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      message.error("Failed to load categories");
      setCategories([]);
      return [];
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/product");
      setProducts(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      message.error("Failed to load products");
      setProducts([]);
      return [];
    }
  };

  // Fetch brand-product mapping
  const fetchBrandProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brandproduct");
      setBrandProductData(res.data.data || []);
    } catch (err) {
      message.error("Failed to load brand products");
    }
  };

  // Fetch lead data by ID (optional, if you want to prefill)
  const fetchLeadDataById = async (leadId) => {
    try {
      const categories = await fetchCategories();
      const products = await fetchProducts();

      const res = await axios.get(`http://localhost:8081/lead/${leadId}`);
      const leadData = res.data.data;

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
        name: customerDetails.name || "",
        mobile: customerDetails.mobileno1 || "",
        city: customerDetails.city || "",
        state: customerDetails.state || "",
        address: customerDetails.address || "",
        source: sourceDetails.name || "",
        leaddate: leadData.leaddate ? dayjs(leadData.leaddate) : null,
      });

      const itemsArray = Array.isArray(leadData?.items) ? leadData.items : [];

      if (itemsArray.length === 0) {
        message.warning("No items found for the given leadId");
        return;
      }

      // Prefill table with one row per product (brand left empty)
      const tableRows = itemsArray.map((item, index) => {
        const category = categories.find((cat) => cat._id === item.categoryid);
        const product = products.find((prod) => prod._id === item.productid);

        const singleweight = product ? Number(product.weight) : 0;
        const quantity = item.quantity || 0;
        const totalWeight = singleweight * quantity;

        return {
          key: item._id || `row-${index}`,
          category: category ? category.name : "Unknown Category",
          categoryid: category ? category._id : "",
          product: product ? product.name : "Unknown Product",
          productid: product ? product._id : null,
          brand: null,
          req: quantity,
          estimationin: item.estimationin || "",
          rate: item.rate || "",
          total: quantity * (item.rate || 0),
          singleweight,
          weight: totalWeight,
        };
      });

      setTableData(tableRows);

      // Store customerid and sourceid for later use
      localStorage.setItem("customerid", leadData.customerid || "");
      localStorage.setItem("sourceid", leadData.sourceid || "");
    } catch (err) {
      message.error("Failed to load lead data");
    }
  };

  // Fetch rate for brand-product
  const fetchRate = async (brandid, productid) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/brandproduct/getRate",
        {
          params: { brandid, productid },
        }
      );
      return response.data.rate || 0;
    } catch (error) {
      return 0;
    }
  };

  // Add a new row
  const addRow = () => {
    setTableData((prev) => [
      ...prev,
      {
        key: `row-${Date.now()}`,
        category: "",
        categoryid: "",
        product: "",
        productid: "",
        brand: "",
        req: "",
        estimationin: "",
        rate: "",
        total: "",
        singleweight: "",
        weight: "",
      },
    ]);
  };

  // Update a row
  const updateRow = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.key === key) {
          const updatedRow = { ...row, [field]: value };

          // If category changes, reset product and brand
          if (field === "category") {
            const catObj = categories.find((cat) => cat._id === value);
            updatedRow.category = catObj ? catObj.name : "";
            updatedRow.categoryid = value;
            updatedRow.product = "";
            updatedRow.productid = "";
            updatedRow.brand = "";
            updatedRow.rate = "";
            updatedRow.total = "";
            updatedRow.singleweight = "";
            updatedRow.weight = "";
          }

          // If product changes, reset brand and fetch singleweight
          if (field === "product") {
            const prodObj = products.find((prod) => prod._id === value);
            updatedRow.product = prodObj ? prodObj.name : "";
            updatedRow.productid = value;
            updatedRow.brand = "";
            updatedRow.rate = "";
            updatedRow.total = "";
            updatedRow.singleweight = prodObj ? Number(prodObj.weight) : "";
            updatedRow.weight = "";
          }

          // If brand changes, fetch rate
          if (field === "brand") {
            fetchRate(value, updatedRow.productid).then((rate) => {
              updatedRow.rate = rate || 0;
              const req = parseFloat(updatedRow.req) || 0;
              updatedRow.total = req * updatedRow.rate;
              setTableData((prev) =>
                prev.map((r) => (r.key === key ? updatedRow : r))
              );
            });
          }

          // If req or rate changes, recalculate total and weight
          if (field === "req" || field === "rate" || field === "singleweight") {
            const req = parseFloat(field === "req" ? value : updatedRow.req) || 0;
            const rate = parseFloat(field === "rate" ? value : updatedRow.rate) || 0;
            const singleweight =
              parseFloat(field === "singleweight" ? value : updatedRow.singleweight) || 0;
            updatedRow.total = req * rate;
            updatedRow.weight = req * singleweight;
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  // Delete a row
  const deleteRow = (key) => {
    setTableData((prev) => prev.filter((row) => row.key !== key));
  };

  // Calculate total sum
  const calculateTotalSum = () => {
    return tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
  };

  // Save handler
  const handleSave = async () => {
    try {
      // Validate form
      const formData = await form.validateFields();

      // Fetch IDs
      const sourceid = localStorage.getItem("sourceid");
      const customerid = localStorage.getItem("customerid");
      const adminid = localStorage.getItem("adminid");

      if (!sourceid || !customerid || !adminid) {
        message.error("Missing Source ID, Customer ID, or Admin ID");
        return;
      }

      // Generate quotation number
      const quotationNo = `QT-${Date.now()}`;

      // Prepare main quotation payload
      const quotationPayload = {
        sourceid,
        customerid,
        quotationno: quotationNo,
        quotationdate: formData.leaddate ? formData.leaddate.format("YYYY-MM-DD") : null,
        baddress: formData.address || "",
        saddress: formData.address || "",
        createdon: new Date().toISOString(),
        adminid,
        totalweight: tableData.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0),
        subtotal: tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0),
        gstamount: 0,
        total: tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0),
        quotationtype: "Multiple Brand",
      };

      // Save quotation
      const quotationRes = await axios.post("http://localhost:8081/quotation", quotationPayload);
      const quotationId = quotationRes.data?.data?._id;

      if (!quotationId) {
        message.error("Failed to get quotation ID from response");
        return;
      }

      // Prepare quotation details payload
      const detailsPayload = tableData.map((row) => ({
        quotationid: quotationId,
        categoryid: row.categoryid || "",
        productid: row.productid || "",
        brandid: row.brand || "",
        estimationin: row.estimationin || "",
        singleweight: Number(row.singleweight || 0),
        quantity: Number(row.req || 0),
        weight: Number(row.weight || 0),
        rate: Number(row.rate || 0),
        amount: Number(row.total || 0),
        narration: row.narration || "",
      }));

      // Save quotation details
      await axios.post("http://localhost:8081/quotationdetail", detailsPayload);

      message.success("Multiple Brand Quotation and details saved successfully!");
      navigate("/lead/lead-record");
    } catch (error) {
      message.error("Failed to save quotation or details.");
    }
  };

  // Form fields
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
    </Form>
  );

  // Table columns
  const columns = [
    {
      title: "Category",
      dataIndex: "categoryid",
      key: "categoryid",
      render: (_, record) => (
        <Select
          placeholder="Select Category"
          value={record.categoryid}
          onChange={(value) => updateRow(record.key, "category", value)}
          style={{ width: "100%" }}
          options={categories.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "productid",
      key: "productid",
      render: (_, record) => (
        <Select
          placeholder="Select Product"
          value={record.productid}
          onChange={(value) => updateRow(record.key, "product", value)}
          style={{ width: "100%" }}
          options={products
            .filter((prod) => !record.categoryid || prod.categoryid === record.categoryid)
            .map((prod) => ({
              value: prod._id,
              label: prod.name,
            }))}
        />
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
      title: "Single Weight",
      dataIndex: "singleweight",
      key: "singleweight",
      render: (_, record) => (
        <Input value={record.singleweight} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Total Weight",
      dataIndex: "weight",
      key: "weight",
      render: (_, record) => (
        <Input value={record.weight} readOnly style={{ backgroundColor: "#f5f5f5" }} />
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBrands();
    fetchBrandProducts();
    fetchCategories();
    fetchProducts();

    const storedLeadId = localStorage.getItem("selectedLeadId");
    if (storedLeadId) {
      fetchLeadDataById(storedLeadId);
    }
  }, []);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>MBQ</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="">Lead</Link>
            </li>
            <li className="breadcrumb-item active">MBQ</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="card p-3 mt-3">{formFields}</div>

        <div className="card p-3 mt-3">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addRow}
            style={{ marginBottom: 16 }}
          >
            Add Row
          </Button>
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

export default MBQ;
