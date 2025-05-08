import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Table, Divider, Button, Spin, message } from "antd";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;

const QuotationDetails = () => {
  const { id } = useParams();
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/quotation/${id}`) // ✅ Your backend route is /quotationdetails/:id
      .then((response) => {
        if (response.data?.status === "success" && response.data.data) {
          setQuotationData(response.data.data); // ✅ Set actual data from response
        } else {
          message.error("Quotation not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching quotation data:", error);
        message.error("Failed to fetch quotation data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  

  const generatePDF = () => {
    const input = document.getElementById("quotation-print-area");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save("quotation.pdf");
    });
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Narration", dataIndex: "narration", key: "narration" },
    { title: "Req", dataIndex: "req", key: "req" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Producer", dataIndex: "producer", key: "producer" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quotationData) {
    return <div style={{ textAlign: "center", marginTop: 100 }}>No quotation data available.</div>;
  }

  return (
    <div className="print-area">
      <div id="quotation-print-area" style={{ padding: "20px", background: "#fff" }}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-area, .print-area * {
                visibility: visible;
              }
              .print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 20px;
                background: white;
              }
              .ant-btn {
                display: none !important;
              }
              .ant-card-head-title {
                font-size: 16px !important;
              }
              .ant-table {
                font-size: 14px !important;
              }
            }
          `}
        </style>

        {/* Header */}
        <Row align="middle" gutter={16}>
          <Col span={4}>
            <img src="/logo192.png" alt="Logo" style={{ maxHeight: 100 }} />
          </Col>
          <Col span={20}>
            <Title level={4} style={{ marginBottom: 0, color: "red" }}>PRITAM STEEL PVT LTD</Title>
            <Text>Nagaon, Kolhapur - 416122</Text>
            <br />
            <Text>Email - sales@pritamsteel.com / adminparshwa@gmail.com</Text>
            <br />
            <Text>Tel - (0230) 2461285, 2460009 Mob - 96078 15933</Text>
            <br />
            <Text><b>GSTIN:</b> 27AALCP1877G1Z1</Text>
          </Col>
        </Row>

        <Divider />

        {/* Quotation Title */}
        <Title level={5} style={{ textAlign: "center" }}>QUOTATION</Title>

        {/* Quotation Meta Info */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Title level={5}>Bill To</Title>
            <Text><b>Name:</b> {quotationData.billTo?.name}</Text><br />
            <Text><b>Contact:</b> {quotationData.billTo?.contact}</Text><br />
            <Text><b>Phone:</b> {quotationData.billTo?.phone}</Text><br />
            <Text><b>Location:</b> {quotationData.billTo?.location}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Ship To</Title>
            <Text><b>Name:</b> {quotationData.shipTo?.name}</Text><br />
            <Text><b>Contact:</b> {quotationData.shipTo?.contact}</Text><br />
            <Text><b>Phone:</b> {quotationData.shipTo?.phone}</Text><br />
            <Text><b>Location:</b> {quotationData.shipTo?.location}</Text>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}><Text><b>Quotation No:</b> {quotationData.details?.quotationNo}</Text></Col>
          <Col span={8}><Text><b>Date:</b> {quotationData.details?.quotationDate}</Text></Col>
          <Col span={8}><Text><b>Owner:</b> {quotationData.details?.owner}</Text></Col>
        </Row>

        {/* Product Table */}
        <Table
          columns={columns}
          dataSource={quotationData.products || []}
          pagination={false}
          bordered
          size="small"
          rowKey="no"
          style={{ marginTop: 20 }}
        />

        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Text strong>Total Weight: {quotationData.totalWeight}</Text>
          <br />
          <Text strong>Total Amount: {quotationData.totalAmount}</Text>
        </div>

        <Divider />
        <div style={{ textAlign: "center" }}>
          <Text type="secondary">One Stop Solution for Variety of Branded Steel</Text>
          <br />
          <img src="https://i.imgur.com/mZTrYHY.png" alt="Steel Logos" style={{ maxHeight: 50 }} />
        </div>

        {/* Buttons */}
        <Row justify="end" style={{ marginTop: 20 }}>
          <Col>
            <Button onClick={() => window.history.back()} style={{ marginRight: 8 }}>Back</Button>
            <Button type="primary" onClick={generatePDF}>Generate PDF</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default QuotationDetails;
