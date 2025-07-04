import React, { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const ModifyQuotation = () => {
  const { id } = useParams(); // Quotation ID from URL
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch brands, categories, products
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      try {
        const [brandRes, catRes, prodRes] = await Promise.all([
          axios.get("http://localhost:8081/brand"),
          axios.get("http://localhost:8081/category"),
          axios.get("http://localhost:8081/product"),
        ]);
        setBrandOptions(
          (brandRes.data.data || []).map((b) => ({ value: b._id, label: b.name }))
        );
        setCategories(catRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        message.error("Failed to load master data");
      }
    };
    fetchAll();
  }, []);

  // Fetch quotation and details
  useEffect(() => {
    const fetchQuotation = async () => {
      setLoading(true);
      try {
        // Fetch main quotation
        const qRes = await axios.get(`http://localhost:8081/quotation/${id}`);
        const q = qRes.data.data;
        // Fetch details
        const dRes = await axios.get(`http://localhost:8081/quotationdetail/byquotation/${id}`);
        const details = dRes.data.data || [];

        // Set form fields
        form.setFieldsValue({
          quotationno: q.quotationno,
          quotationdate: dayjs(q.quotationdate),
          baddress: q.baddress,
          saddress: q.saddress,
        });

        // Prepare table data
        const rows = details.map((item, idx) => {
          const category = categories.find((cat) => cat._id === (item.categoryid?._id || item.categoryid));
          const product = products.find((prod) => prod._id === (item.productid?._id || item.productid));
          return {
            key: item._id || `row-${idx}`,
            category: category ? category.name : "",
            categoryid: category ? category._id : "",
            product: product ? product.name : "",
            productid: product ? product._id : "",
            brand: item.brandid?._id || item.brandid || "",
            req: item.quantity || "",
            estimationin: item.estimationin || "",
            rate: item.rate || "",
            total: item.amount || "",
            narration: item.narration || "",
          };
        });
        setTableData(rows);
      } catch (err) {
        message.error("Failed to load quotation for editing");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
    // eslint-disable-next-line
  }, [id, categories, products]);

  // Update row logic (similar to SBQ)
  const updateRow = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) => {
        if (row.key === key) {
          const updatedRow = { ...row, [field]: value };
          // If req or rate is updated, recalculate total
          if (field === "req" || field === "rate") {
            const req = parseFloat(field === "req" ? value : updatedRow.req) || 0;
            const rate = parseFloat(field === "rate" ? value : updatedRow.rate) || 0;
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      // Validate form
      const formData = await form.validateFields();

      // 1. Update main quotation
      await axios.put(`http://localhost:8081/quotation/${id}`, {
        quotationno: formData.quotationno,
        quotationdate: formData.quotationdate.format("YYYY-MM-DD"),
        baddress: formData.baddress,
        saddress: formData.saddress,
      });

      // 2. Delete all old details for this quotation
      await axios.delete(`http://localhost:8081/quotationdetail/byquotation/${id}`);

      // 3. Prepare and insert new details
      const detailsPayload = tableData.map((row) => ({
        quotationid: id,
        categoryid: row.categoryid,
        productid: row.productid,
        brandid: row.brand,
        estimationin: row.estimationin,
        quantity: Number(row.req),
        rate: Number(row.rate),
        amount: Number(row.total),
        narration: row.narration,
      }));
      console.log("detailsPayload", detailsPayload);
      await axios.post("http://localhost:8081/quotationdetail", detailsPayload);

      message.success("Quotation updated successfully!");
      navigate("/quotation/list");
    } catch (err) {
      message.error("Failed to update quotation");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, record) => (
        <Select
          value={record.categoryid}
          style={{ width: "100%" }}
          onChange={(value) => {
            const cat = categories.find((c) => c._id === value);
            updateRow(record.key, "category", cat ? cat.name : "");
            updateRow(record.key, "categoryid", value);
          }}
          options={categories.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (_, record) => (
        <Select
          value={record.productid}
          style={{ width: "100%" }}
          onChange={(value) => {
            const prod = products.find((p) => p._id === value);
            updateRow(record.key, "product", prod ? prod.name : "");
            updateRow(record.key, "productid", value);
          }}
          options={products.map((prod) => ({
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
          value={record.brand}
          style={{ width: "100%" }}
          onChange={(value) => updateRow(record.key, "brand", value)}
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
    // {
    //   title: "Unit",
    //   dataIndex: "estimationin",
    //   key: "estimationin",
    //   render: (_, record) => (
    //     <Select
    //       value={record.estimationin}
    //       style={{ width: "100%" }}
    //       onChange={(value) => updateRow(record.key, "estimationin", value)}
    //       options={[
    //         { value: "Kg", label: "Kg" },
    //         { value: "Meter", label: "Meter" },
    //         { value: "Feet", label: "Feet" },
    //         { value: "No's", label: "No's" },
    //       ]}
    //     />
    //   ),
    // },
    {
      title: "Unit",
      dataIndex: "estimationin",
      key: "estimationin",
      render: (_, record) => (
        <Input value={record.estimationin} readOnly style={{ backgroundColor: "#f5f5f5" }} />
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
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
      render: (_, record) => (
        <Input
          value={record.narration}
          onChange={(e) => updateRow(record.key, "narration", e.target.value)}
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
          className="action-button delete-button"
          onClick={() => deleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Modify Quotation</h1>
      </div>
      <section className="section">
        <div className="card p-3 mt-3">
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Quotation No" name="quotationno">
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Quotation Date" name="quotationdate">
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Billing Address" name="baddress">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Shipping Address" name="saddress">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <div className="text-end">
              <Button type="primary" onClick={handleUpdate} loading={loading}>
                Update Quotation
              </Button>
            </div>
          </Form>
        </div>
        <div className="card p-3 mt-3">
          <Table
            dataSource={tableData}
            columns={columns}
            rowKey="key"
            pagination={false}
          />
        </div>
      </section>
    </main>
  );
};

export default ModifyQuotation;