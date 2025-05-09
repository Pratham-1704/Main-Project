import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Descriptions,
  Spin,
  message,
  Table,
  Row,
  Col,
  Typography,
  Divider,
  Button,
} from "antd";
import dayjs from "dayjs";
import { jsPDF } from "jspdf"; // Import jsPDF

const { Title, Text } = Typography;

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState(null); // State for customer details
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const storedId = id || localStorage.getItem("selectedLeadId");
        if (!storedId) {
          messageApi.error("No lead ID provided");
          return;
        }

        const [leadRes, catRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:8081/lead/${storedId}`),
          axios.get("http://localhost:8081/category"),
          axios.get("http://localhost:8081/product"),
        ]);

        const leadData = leadRes.data.data;
        setLead(leadData);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);

        // Fetch customer details using customerid
        if (leadData.customerid) {
          const customerRes = await axios.get(
            `http://localhost:8081/customer/${leadData.customerid}`
          );
          setCustomer(customerRes.data.data);
        }
      } catch (err) {
        messageApi.error("Failed to fetch lead or supporting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : "Unknown Category";
  };

  const getProductName = (id) => {
    const prod = products.find((p) => p._id === id);
    return prod ? prod.name : "Unknown Product";
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Req", dataIndex: "quantity", key: "quantity" },
    { title: "Unit", dataIndex: "estimationin", key: "estimationin" },
    { title: "Weight", dataIndex: "quantity", key: "quantity" },
    { title: "Narration", dataIndex: "narration", key: "narration" },
  ];

  const tableData =
    lead?.items?.map((item, index) => ({
      key: index,
      no: index + 1,
      category: getCategoryName(item.categoryid),
      product: getProductName(item.productid),
      estimationin: item.estimationin,
      brand: item.brand,
      req: item.req,
      unit: item.unit,
      quantity: item.quantity,
      narration: item.narration,
    })) || [];

  const totalWeight = tableData.reduce(
    (acc, item) => acc + parseFloat(item.quantity || 0),
    0
  );

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    
    // Add logo
    doc.addImage(
      "https://th.bing.com/th/id/OIP.nOL8HH_1fafIVupyd9raegAAAA?rs=1&pid=ImgDetMain",
      "PNG",
      10,
      10,
      30,
      30
    );

    doc.text("PARSHWANATH ISPAT PVT LTD", 50, 20);
    doc.text("120/1, P.B.Road, N.H.4, SHIROLI(P), KOLHAPUR", 50, 30);
    doc.text("Email - purchase@parshwanathsteel.com", 50, 40);
    doc.text("Tel - (0230) 2461285, 2460009 Mob - 96078 15933", 50, 50);
    doc.text("GSTIN: 27AAFCP4825L1Z2", 50, 60);
    doc.text("LEAD", 100, 80);

    // Add Lead Details
    doc.text(`Lead No: ${lead.leadno}`, 10, 100);
    doc.text(`Lead Date: ${dayjs(lead.leaddate).format("DD/MM/YYYY")}`, 10, 110);
    doc.text("Payment Term: Against Delivery", 10, 120);
    doc.text("Owner: Deepak_Shinde", 10, 130);
    doc.text("CRM: Deepak_Shinde", 10, 140);

    // Add Items Table
    let yOffset = 150;
    tableData.forEach((item, index) => {
      doc.text(`${item.no}. ${item.category} - ${item.product} - ${item.brand}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Quantity: ${item.quantity} ${item.unit}`, 10, yOffset);
      yOffset += 10;
      doc.text(`Narration: ${item.narration}`, 10, yOffset);
      yOffset += 20;
    });

    // Add total weight
    doc.text(`Total Weight: ${totalWeight.toFixed(1)} Kg`, 10, yOffset);

    // Save the document
    doc.save(`Lead_${lead.leadno}.pdf`);
  };

  if (loading) return <Spin tip="Loading..." fullscreen />;
  if (!lead) return <div>No lead found.</div>;

  return (
    <>
      {/* Print Styles */}
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
          }
          .hide-on-print {
            display: none !important;
          }
          .ant-card {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <section style={{ background: "#f0f2f5", padding: "10px", marginTop: "80px", marginLeft: "300px" }}>
        <div
          className="printable-area"
          style={{
            padding: "10px 20px",
            background: "#fff",
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >
          {contextHolder}

          {/* Header */}
          <Row justify="center" align="middle" style={{marginLeft:"100px"}} gutter={16}>
            <Col span={6}>
              <img
                src="https://th.bing.com/th/id/OIP.nOL8HH_1fafIVupyd9raegAAAA?rs=1&pid=ImgDetMain"
                alt="Logo"
                style={{ maxHeight: "120px", width: "auto" }}
              />
            </Col>
            <Col span={18}>
              <Title level={4} style={{ marginBottom: 4, color: "orange" }}>
                PARSHWANATH ISPAT PVT LTD
              </Title>
              <Text style={{ fontSize: "12px" }}>120/1, P.B.Road, N.H.4, SHIROLI(P), KOLHAPUR</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>Email - purchase@parshwanathsteel.com</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>Tel - (0230) 2461285, 2460009 Mob - 96078 15933</Text>
              <br />
              <Text style={{ fontSize: "12px" }}>
                <b>GSTIN</b>: 27AAFCP4825L1Z2
              </Text>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Title level={5} style={{ textAlign: "center", marginBottom: 10 }}>
            LEAD
          </Title>

          {/* Cards Section */}
          <Row gutter={12} style={{ marginTop: 10, display: "flex", alignItems: "stretch" }}>
            {[...Array(3)].map((_, idx) => (
              <Col span={8} style={{ display: "flex" }} key={idx}>
                <Card
                  title={["Bill To", "Ship To", "Details"][idx]}
                  style={{ width: "100%", fontSize: "12px" }}
                  bodyStyle={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "12px" }}
                >
                  {idx < 2 ? (
                    <>
                      <Text strong>{customer?.name || "Customer Name"}</Text>
                      <Text>{customer?.mobileno1 || "Customer Mobile"}</Text>
                      <Text style={{ fontSize: "12px" }}>
                        {customer?.address || "Customer Address"}
                      </Text>
                      <Text>
                        <b>GST No.:</b> {customer?.gst || "Customer GST"}
                      </Text>
                    </>
                  ) : (
                    <>
                      <p><b>Lead No :</b> {lead.leadno}</p>
                      <p><b>Lead Date :</b> {dayjs(lead.leaddate).format("DD/MM/YYYY")}</p>
                      <p><b>Payment Term :</b> Against Delivery</p>
                      <p><b>Owner :</b> Deepak_Shinde</p>
                      <p><b>CRM :</b> Deepak_Shinde</p>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          {/* Items Table */}
          <div style={{ marginTop: 20 }}>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              bordered
              size="small"
              style={{ fontSize: "12px" }}
            />
          </div>

          {/* Total Weight */}
          <div style={{ textAlign: "right", marginTop: 5 }}>
            <Text strong>Total Weight : {totalWeight.toFixed(1)} Kg</Text>
          </div>

          {/* Buttons */}
          <Row
            className="hide-on-print"
            justify="end"
            gutter={8}
            style={{ marginTop: 15 }}
          >
            <Col>
              <Button type="default" onClick={() => window.history.back()}>
                Back
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => window.print()}>
                Print
              </Button>
            </Col>
            <Col>
              <Link to="/lead/sbq">
                <Button type="dashed">SBQ</Button>
              </Link>
            </Col>
            <Col>
              <Link to="/lead/mbq">
                <Button type="dashed">MBQ</Button>
              </Link>
            </Col>
            <Col>
              <Button type="default" onClick={generatePDF}>
                Generate PDF
              </Button>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default LeadDetails;
