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
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PrintableLeadDetails from "./PrintableLeadDetails";


const Leads = () => {
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

  const columns = [
    {
      title: "Sr No",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (_, record) => (
        <Select
          style={{ width: 150 }}
          value={record.category}
          onChange={(val) => handleRowChange(record.key, "category", val)}
          placeholder="Select Category"
          options={categories.map((cat) => ({ label: cat.name, value: cat._id }))}
        />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (_, record) => {
        const filteredProducts = products.filter(
          (p) => p.categoryid === record.category
        );
        return (
          <Select
            style={{ width: 150 }}
            value={record.product}
            onChange={(val) => handleRowChange(record.key, "product", val)}
            options={filteredProducts.map((p) => ({ label: p.name, value: p._id }))}
            placeholder="Select Product"
            disabled={!record.category}
          />
        );
      },
    },
    {
      title: "IN",
      dataIndex: "in",
      render: (_, record) => (
        <Select
          style={{ width: 120 }}
          value={record.in}
          onChange={(val) => handleRowChange(record.key, "in", val)}
          options={[
            { label: "KG", value: "kg" },
            { label: "FEET", value: "feet" },
            { label: "METER", value: "meter" },
            { label: "NOS", value: "nos" },
          ]}
          placeholder="Select Unit"
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_, record) => (
        <Input
          value={record.quantity}
          type="number"
          style={{ width: 100 }}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            handleRowChange(record.key, "quantity", value >= 0 ? value : 0);
          }}
        />
      ),
    },
    {
      title: "Narration",
      dataIndex: "narration",
    
      render: (_, record) => (
        <Input
          value={record.narration}
          style={{ width: 200 }}
          onChange={(e) => handleRowChange(record.key, "narration", e.target.value)}
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this row?"
          onConfirm={() => removeRow(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const fetchLeadRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8081/lead");
      setLeadRecords(res.data.data || []);
    } catch (err) {
      messageApi.error("Failed to fetch lead records");
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
    form.setFieldsValue({
      leaddate: dayjs(record.leaddate),
      customerid: record.customerid,
      sourceid: record.sourceid,
    });
    setLeadnoPreview(record.leadno);
    const updatedRows = record.items.map((item, index) => ({
      key: index,
      category: item.categoryid,
      product: item.productid,
      in: item.estimationin,
      quantity: item.quantity,
      narration: item.narration || "",
    }));
    setRows(updatedRows);
    setShowItemsTable(true); // show table on edit
  };

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("printRef:", printRef.current); // Debugging
      if (!printRef.current) {
        messageApi.error("There is nothing to print");
        return null;
      }
      return printRef.current;
    },
  });

  // const handlePrintByLeadId = async (leadid) => {
  //   try {
  //     const res = await axios.get(`http://localhost:8081/lead/${leadid}`);
  //     const lead = res.data.data;

  //     if (!lead) {
  //       messageApi.error("Failed to fetch lead details for printing");
  //       return;
  //     }

  //     // Map categoryName and productName for each item
  //     const updatedItems = lead.items.map((item) => ({
  //       ...item,
  //       categoryName: categories.find((cat) => cat._id === item.categoryid)?.name || "N/A",
  //       productName: products.find((prod) => prod._id === item.productid)?.name || "N/A",
  //     }));

  //     setSelectedLead({
  //       ...lead,
  //       items: updatedItems,
  //     });

  //     handlePrint();
  //   } catch (err) {
  //     console.error("Error fetching lead details:", err);
  //     messageApi.error("Failed to fetch lead details for printing");
  //   }
  // };

  // const handleExportToPDF = async (lead) => {
  //   if (!lead) {
  //     messageApi.error("No lead details available to export.");
  //     return;
  //   }

  //   try {
  //     // Map categoryName and productName for each item
  //     const updatedItems = lead.items.map((item) => ({
  //       ...item,
  //       categoryName: categories.find((cat) => cat._id === item.categoryid)?.name || "N/A",
  //       productName: products.find((prod) => prod._id === item.productid)?.name || "N/A",
  //     }));

  //     setSelectedLead({
  //       ...lead,
  //       items: updatedItems,
  //     });

  //     // Delay to ensure rendering before exporting
  //     setTimeout(() => {
  //       const element = document.getElementById("printable-area");
  //       if (!element) {
  //         messageApi.error("Printable area not found.");
  //         return;
  //       }

  //       html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         const pdf = new jsPDF("p", "mm", "a4");
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        //   pdf.save(`Lead-${lead.leadno}.pdf`);
        //   messageApi.success("PDF exported successfully!");
        // });
  //     }, 500);
  //   } catch (err) {
  //     console.error("Error exporting PDF:", err);
  //     messageApi.error("Failed to export PDF.");
  //   }
  // };

  const leadColumns = [
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
            onClick={() => handleUpdate(record)}
          />
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
          {/* <Button
            icon={<PlusCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedLead(record); // Set the selected lead
              setTimeout(() => handleExportToPDF(record), 0); // Delay to ensure rendering
            }}
          >
            Export to PDF
          </Button> */}
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

        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-md-3">
                  <Form.Item name="leaddate" label="Lead Date" rules={[{ required: true }]}>
                    <DatePicker className="w-100" format="DD-MM-YYYY" />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item label="Lead No">
                    <Input value={leadnoPreview} disabled />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="customerid" label="Customer" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select Customer"
                      options={customers.map((c) => ({ label: c.name, value: c._id }))}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item name="sourceid" label="Source" rules={[{ required: true }]}>
                    <Select
                      placeholder="Select Source"
                      options={source.map((s) => ({ label: s.name, value: s._id }))}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="text-end">
                <Button type="primary" onClick={() => setShowItemsTable(true)}>
                  Add New
                </Button>
              </div>
            </Form>
          </div>

          {showItemsTable && (
            <div className="card p-3 mt-3">
              <Table dataSource={rows} columns={columns} rowKey="key" pagination={false} />
              <div className="text-end mt-2">
                <Button
                  type="dashed"
                  icon={<PlusCircleOutlined />}
                  onClick={addRow}
                  size="small"
                >
                  Add Row
                </Button>
              </div>
              <div className="mt-3 text-end">
                <Button type="primary" onClick={handleSubmit}>
                  Save
                </Button>
                <Button
                  className="ms-2"
                  onClick={() => {
                    setShowItemsTable(false);
                    setRows([{ key: 0, category: null, product: null, in: null, quantity: '', narration: '' }]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="card p-3 mt-3">
            <Table dataSource={leadRecords} columns={leadColumns} rowKey="_id" pagination={false} />
          </div>
        </section>

        {/* Hidden Printable Component */}
        {selectedLead && (
          <div style={{ display: "none" }}>
            <PrintableLeadDetails
              ref={printRef}
              lead={selectedLead}
            />
          </div>
        )}

        {/* Hidden Printable Area */}
        {selectedLead && (
          <div id="printable-area">
            {/* Header Section */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1 style={{ margin: 0, fontSize: "24px", color: "#333" }}>Company Name</h1>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                Address Line 1, Address Line 2, City, State, ZIP
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>Phone: (123) 456-7890 | Email: info@company.com</p>
              <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />
            </div>

            {/* Lead Details Section */}
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Lead Details</h2>
              <p><strong>Lead No:</strong> {selectedLead.leadno}</p>
              <p><strong>Lead Date:</strong> {dayjs(selectedLead.leaddate).format("DD-MM-YYYY")}</p>
              <p><strong>Customer:</strong> {selectedLead.customerName}</p>
              <p><strong>Source:</strong> {selectedLead.sourceName}</p>
              <p><strong>Admin:</strong> {selectedLead.adminName}</p>
            </div>

            {/* Items Table Section */}
            {selectedLead.items && selectedLead.items.length > 0 ? (
              <table
                border="1"
                cellPadding="10"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5", color: "#333" }}>
                    <th>Category</th>
                    <th>Product</th>
                    <th>Estimation Unit</th>
                    <th>Quantity</th>
                    <th>Narration</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLead.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.categoryName || "N/A"}</td>
                      <td>{item.productName || "N/A"}</td>
                      <td>{item.estimationin || "N/A"}</td>
                      <td>{item.quantity || "0"}</td>
                      <td>{item.narration || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items available for this lead.</p>
            )}

            {/* Footer Section */}
            <div style={{ marginTop: "40px", textAlign: "center", color: "#555", fontSize: "12px" }}>
              <hr style={{ margin: "20px 0", border: "1px solid #ddd" }} />
              <p>Thank you for choosing our services!</p>
              <p>Company Name | www.iGAP.com</p>
            </div>
          </div>
        )}
      </main>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        `}
      </style>
    </>
  );
};

export default Leads;
