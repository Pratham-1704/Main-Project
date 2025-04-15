import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrintableLeadDetails from "./PrintableLeadDetails";


const LeadRecord = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [source, setSources] = useState([]);
  const [rows, setRows] = useState([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }]);
  const [messageApi, contextHolder] = message.useMessage();
  const [leadnoPreview, setLeadnoPreview] = useState("");
  const [leadRecords, setLeadRecords] = useState([]);
  const [showItemsTable, setShowItemsTable] = useState(false);
  const printRef = useRef(); // Ref for the printable component
  const [selectedLead, setSelectedLead] = useState(null); // State to store the selected lead for printing
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitials();
    fetchLeadRecords();
  }, []);

  const fetchInitials = async () => {
    try {
      const [cust, cat, prod, src] = await Promise.all([
        axios.get("http://localhost:8081/customer"),
        axios.get("http://localhost:8081/category"),
        axios.get("http://localhost:8081/product"),
        axios.get("http://localhost:8081/source"),
      ]);

      setCustomers(cust.data.data || []);
      setCategories(cat.data.data || []);
      setProducts(prod.data.data || []);
      setSources(src.data.data || []);
      generateNextLeadNo();
      form.setFieldsValue({ createdon: dayjs() });
    } catch (err) {
      messageApi.error("Failed to load initial data");
    }
  };

  const generateNextLeadNo = async () => {
    const today = new Date();
    const datePart = today.toLocaleDateString("en-GB").replace(/\//g, "");
    const prefix = `LD${datePart}`;

    try {
      const res = await axios.get("http://localhost:8081/lead");
      const leads = res.data.status === "success" ? res.data.data : [];

      const todayLeads = leads.filter((lead) => lead.leadno.startsWith(prefix));
      const maxNumber = todayLeads.reduce((max, lead) => {
        const numPart = parseInt(lead.leadno.split("-")[1], 10);
        return numPart > max ? numPart : max;
      }, 0);

      const nextNumber = String(maxNumber + 1).padStart(3, "0");
      const nextLeadNo = `${prefix}-${nextNumber}`;
      setLeadnoPreview(nextLeadNo);
      return nextLeadNo;
    } catch {
      const fallback = `${prefix}-001`;
      setLeadnoPreview(fallback);
      return fallback;
    }
  };

  const handleRowChange = (key, field, value) => {
    const updated = rows.map((row) =>
      row.key === key ? { ...row, [field]: value, ...(field === 'category' ? { product: null } : {}) } : row
    );
    setRows(updated);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { key: Date.now(), category: null, product: null, in: null, quantity: '', narration: '' }]);
  };

  const removeRow = (key) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const leadno = await generateNextLeadNo();
      const adminId = localStorage.getItem("adminid");

      const leadPayload = {
        leadno,
        leaddate: values.leaddate?.toISOString(),
        createdon: values.createdon?.toISOString(),
        sourceid: values.sourceid,
        customerid: values.customerid,
        adminid: adminId,
        items: rows.map((row) => ({
          categoryid: row.category,
          productid: row.product,
          estimationin: row.in,
          quantity: row.quantity,
          narration: row.narration || "",
        })),
      };

      await axios.post("http://localhost:8081/lead", leadPayload);

      messageApi.success("Leads saved successfully!");
      setRows([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }]);
      form.resetFields();
      form.setFieldsValue({ createdon: dayjs() });
      generateNextLeadNo();
      setShowItemsTable(false);
      fetchLeadRecords();
    } catch (err) {
      console.error("Error saving leads:", err.response?.data || err.message);
      messageApi.error("Failed to save leads.");
    }
  };

  const fetchLeadRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/lead");
      setLeadRecords(res.data.data || []);
    } catch (err) {
      messageApi.error("Failed to fetch lead records");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/lead/${id}`);
      messageApi.success("Lead deleted successfully");
      fetchLeadRecords();
    } catch (err) {
      messageApi.error("Failed to delete lead");
    }
  };

  const handleUpdate = (record) => {
    navigate("/lead/new-lead", { state: { record } }); // Navigate to the Lead page with the record
  };

 
  const leadColumns = [
    {
      title: "Sr No",
      key: "srno",
      render: (_, __, index) => index + 1, // Serial number
    },
    {
      title: "Lead No",
      dataIndex: "leadno",
      key: "leadno",
    },
    {
      title: "Lead Date",
      dataIndex: "leaddate",
      key: "leaddate",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Customer",
      dataIndex: "customerid",
      key: "customerid",
      render: (text) => customers.find((c) => c._id === text)?.name || "N/A",
    },
    {
      title: "Source",
      dataIndex: "sourceid",
      key: "sourceid",
      render: (text) => source.find((s) => s._id === text)?.name || "N/A",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => handleUpdate(record)} // Call handleUpdate
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
          <Button
            icon={<PlusCircleOutlined />}
            size="small"
            onClick={async () => {
              try {
                // Fetch the lead details by ID
                const res = await axios.get(`http://localhost:8081/lead/${record._id}`);
                const lead = res.data.data;
          
                if (!lead) {
                  messageApi.error("Failed to fetch lead details for printing");
                  return;
                }
          
                // Map categoryName and productName for each item
                const updatedItems = lead.items.map((item) => ({
                  ...item,
                  categoryName: categories.find((cat) => cat._id === item.categoryid)?.name || "N/A",
                  productName: products.find((prod) => prod._id === item.productid)?.name || "N/A",
                }));
          
                // Fetch admin name from local storage
                const adminName = localStorage.getItem("adminname") || "N/A";
          
                // Set the selected lead with all details
                setSelectedLead({
                  ...lead,
                  items: updatedItems,
                  customerName: customers.find((c) => c._id === lead.customerid)?.name || "N/A",
                  sourceName: source.find((s) => s._id === lead.sourceid)?.name || "N/A",
                  adminName, // Add admin name here
                });
          
                // Delay to ensure the DOM updates before printing
                setTimeout(() => window.print(), 0);
              } catch (err) {
                console.error("Error fetching lead details:", err);
                messageApi.error("Failed to fetch lead details for printing");
              }
            }}
          >
            Print
          </Button>
         </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Leads</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
              <li className="breadcrumb-item active">Leads</li>
            </ol>
          </nav>
        </div>

        { <section className="section">
          <div className="card p-3 mt-3">
            <Table dataSource={leadRecords} columns={leadColumns} rowKey="_id" pagination={false} loading={loading} />
          </div>
        </section> }

      </main>
    </>
  );
};

export default LeadRecord;
