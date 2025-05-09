import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Button,
  Card,
  message,
} from "antd";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;

const QuotationDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);

  const fallbackQuotation = {
    quotationno: "QT-000000",
    quotationdate: "2025-01-01",
    owner: "Admin",
    baddress: "Billing Address not available",
    saddress: "Shipping Address not available",
    loadingCharges: 0,
    cuttingCharges: 0,
    subtotal: 0,
    gstamount: 0,
    total: 0,
    quotationtype: "Standard",
    products: [],
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8081/quotation/${id}`)
      .then((res) => {
        // console.log(id);
console.log(res.data);  
        setQuotation(res.data.data);
      })
      .catch(() => {
        message.error("Failed to fetch quotation. Showing fallback data.");
        setQuotation(fallbackQuotation);
      });
  }, [id]);

  const generatePDF = () => {
    const input = document.getElementById("quotation-print-area");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("quotation.pdf");
    });
  };

  if (!quotation) return null;

  return (
    <div className="container-fluid" >
    <div className="print-area" style={{ paddingTop: "60px", maxWidth: 850, marginLeft: "300px", background: "#fff" }}>
      <div id="quotation-print-area">
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
                background: white;
              }
              .ant-btn {
                display: none !important;
              }
            }
          `}
        </style>

        {/* Header */}
        <Row align="middle" gutter={12}>
          <Col span={4}>
            <img src="/logo192.png" alt="Logo" style={{ maxHeight: 80 }} />
          </Col>
          <Col span={20}>
            <Title level={4} style={{ marginBottom: 0, color: "red" }}>PRITAM STEEL PVT LTD</Title>
            <Text>Nagaon, Kolhapur - 416122</Text><br />
            <Text>Email: sales@pritamsteel.com / adminparshwa@gmail.com</Text><br />
            <Text>Tel: (0230) 2461285, 2460009 Mob: 96078 15933</Text><br />
            <Text><b>GSTIN:</b> 27AALCP1877G1Z1</Text>
          </Col>
        </Row>

        <Divider />

        {/* Quotation Info */}
        <Title level={5} style={{ textAlign: "center" }}>QUOTATION</Title>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card title="Bill To" size="small">
              <Text>{quotation.baddress}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Ship To" size="small">
              <Text>{quotation.saddress}</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}><Text><b>Quotation No:</b> {quotation.quotationno}</Text></Col>
          <Col span={8}><Text><b>Date:</b> {quotation.quotationdate}</Text></Col>
          <Col span={8}><Text><b>Type:</b> {quotation.quotationtype}</Text></Col>
        </Row>

        {/* Products Table */}
        <Table
          dataSource={quotation.products || []}
          pagination={false}
          size="small"
          bordered
          rowKey={(record, index) => index}
          columns={[
            {
              title: "No",
              dataIndex: "index",
              render: (_, __, i) => i + 1,
            },
            {
              title: "Product",
              dataIndex: "productname",
              key: "productname",
            },
            {
              title: "Size",
              dataIndex: "size",
              key: "size",
            },
            {
              title: "Narration",
              dataIndex: "narration",
              key: "narration",
            },
            {
              title: "Qty",
              dataIndex: "quantity",
              key: "quantity",
            },
            {
              title: "Rate",
              dataIndex: "rate",
              key: "rate",
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
            },
          ]}
        />

        {/* Charges Summary */}
        <Row justify="end" style={{ marginTop: 20 }}>
          <Col span={8}>
            <Row justify="space-between"><Col><Text>Loading Charges:</Text></Col><Col><Text>₹{quotation.loadingCharges}</Text></Col></Row>
            <Row justify="space-between"><Col><Text>Cutting Charges:</Text></Col><Col><Text>₹{quotation.cuttingCharges}</Text></Col></Row>
            <Row justify="space-between"><Col><Text>Subtotal:</Text></Col><Col><Text>₹{quotation.subtotal}</Text></Col></Row>
            <Row justify="space-between"><Col><Text>GST (18%):</Text></Col><Col><Text>₹{quotation.gstamount}</Text></Col></Row>
            <Row justify="space-between"><Col><Text strong>Total:</Text></Col><Col><Text strong>₹{quotation.total}</Text></Col></Row>
          </Col>
        </Row>

        {/* Footer */}
        <Divider />
        <div style={{ textAlign: "center" }}>
          <Text type="secondary">One Stop Solution for Variety of Branded Steel</Text><br />
          <img src="https://i.imgur.com/mZTrYHY.png" alt="Steel Logos" style={{ maxHeight: 40 }} />
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
    </div>
  );
};

export default QuotationDetails;
