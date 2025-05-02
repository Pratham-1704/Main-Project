import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Typography, Table, Card, Divider, Button } from "antd";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;

const QuotationDetails = () => {
  const [quotationData, setQuotationData] = useState(null);

  useEffect(() => {
    axios.get("http:localhost:8081/quotation/1") // Replace with actual API endpoint
      .then(response => {
        if (response.data && response.data.length > 0) {
          setQuotationData(response.data);
        } else {
          setQuotationData(sampleData); // Use fallback sample data
        }
      })
      .catch(() => {
        setQuotationData(sampleData); // Handle error & use sample data
      });
  }, []);

  const sampleData = {
    billTo: { name: "Krida Buildcon LLP - Mapusa, Goa", contact: "Swapnil Gupta", phone: "9359654281", location: "Porvarim - GOA" },
    shipTo: { name: "Krida Buildcon LLP - Mapusa, Goa", contact: "Swapnil Gupta", phone: "9359654281", location: "Porvarim - GOA" },
    details: { quotationNo: "PIPL/SBQ/15-04-25/00561", quotationDate: "15-04-2025", paymentTerm: "Advance", owner: "Abhishek" },
    products: [
      { no: 1, product: "Plate", size: "32mm CTL", narration: "Plate 32mm 2500*6000 - 1 no", req: "1", unit: "Kgs", producer: "SAIL", quantity: "3,800.0 Kgs", rate: "₹ 56.00/Kgs", amount: "₹ 212,800.00" },
      { no: 2, product: "Plate", size: "20mm*2000*6300", narration: "", req: "1", unit: "Nos", producer: "AM/NS (Essar)", quantity: "2,015.0 Kgs", rate: "₹ 54.00/Kgs", amount: "₹ 108,810.00" },
    ],
    totalWeight: "5,815.0 Kg",
    totalAmount: "₹ 321,610.00",
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

        <Title level={5} style={{ textAlign: "center" }}>QUOTATION</Title>

        {/* Product Table */}
        <Table columns={columns} dataSource={quotationData?.products} pagination={false} bordered size="small" style={{ marginTop: 20 }} />

        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Text strong>Total Weight: {quotationData?.totalWeight}</Text>
          <br />
          <Text strong>Total Amount: {quotationData?.totalAmount}</Text>
        </div>

        {/* Footer */}
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
