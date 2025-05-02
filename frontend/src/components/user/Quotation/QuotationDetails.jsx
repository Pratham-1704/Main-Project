import React from "react";
import { Row, Col, Typography, Table, Card, Divider, Button } from "antd";

const { Title, Text } = Typography;

const QuotationDetails = () => {
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

  const dataSource = [
    {
      no: 1,
      product: "Plate",
      size: "32mm CTL",
      narration: "Plate 32mm 2500*6000 - 1 no",
      req: "1",
      unit: "Kgs",
      producer: "SAIL",
      quantity: "3,800.0 Kgs",
      rate: "₹ 56.00/Kgs",
      amount: "₹ 212,800.00",
    },
    {
      no: 2,
      product: "Plate",
      size: "20mm*2000*6300",
      narration: "",
      req: "1",
      unit: "Nos",
      producer: "AM/NS (Essar)",
      quantity: "2,015.0 Kgs",
      rate: "₹ 54.00/Kgs",
      amount: "₹ 108,810.00",
    },
  ];

  const totalWeight = "5,815.0 Kg";
  const totalAmount = "₹ 321,610.00";

  return (
    <div style={{ padding: 200, marginLeft:"400px", background: "#fff", maxWidth: 1200 }}>
      {/* Header */}
      <Row align="middle" justify="center" gutter={16}>
        <Col span={4}>
          <img src="/logo192.png" alt="Logo" style={{ maxHeight: 100 }} />
        </Col>
        <Col span={20}>
          <Title level={4} style={{ marginBottom: 0, color: "red" }}>
            PRITAM STEEL PVT LTD
          </Title>
          <Text>Nagaon, Kolhapur - 416122</Text>
          <br />
          <Text>Email - sales@pritamsteel.com / adminparshwa@gmail.com</Text>
          <br />
          <Text>Tel - (0230) 2461285, 2460009 Mob - 96078 15933, 960 (77/76/75/74)</Text>
          <br />
          <Text>
            <b>GSTIN:</b> 27AALCP1877G1Z1
          </Text>
        </Col>
      </Row>

      <Divider />

      <Title level={5} style={{ textAlign: "center" }}>
        QUOTATION
      </Title>

      {/* Top Cards */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Bill To">
            <Text strong>Krida Buildcon LLP - Mapusa, Goa</Text>
            <br />
            <Text>Swapnil Gupta</Text>
            <br />
            <Text>9359654281</Text>
            <br />
            <Text>Porvarim - GOA</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Ship To">
            <Text strong>Krida Buildcon LLP - Mapusa, Goa</Text>
            <br />
            <Text>Swapnil Gupta</Text>
            <br />
            <Text>9359654281</Text>
            <br />
            <Text>Porvarim - GOA</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Details">
            <p><b>Quotation No:</b> PIPL/SBQ/15-04-25/00561</p>
            <p><b>Quotation Date:</b> 15-04-2025</p>
            <p><b>Payment Term:</b> Advance</p>
            <p><b>Owner:</b> Abhishek</p>
          </Card>
        </Col>
      </Row>

      {/* Product Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="small"
        style={{ marginTop: 20 }}
      />

      <div style={{ textAlign: "right", marginTop: 5 }}>
        <Text strong>Total Weight: {totalWeight}</Text>
        <br />
        <Text strong>Total Amount: {totalAmount}</Text>
      </div>

      {/* Charges Summary */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Bank Details">
            <p><b>Account:</b> PRITAM STEEL PVT LTD</p>
            <p><b>Acc No:</b> 59209823115933</p>
            <p><b>IFSC:</b> HDFC0000164</p>
            <p><b>Bank:</b> HDFC BANK LTD</p>
            <p><b>Branch:</b> Shahupuri, Kolhapur</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Charges & Totals">
            <p>Loading Charges: ₹ 2,035.25</p>
            <p>Cutting Charges: ₹ 600.00</p>
            <p>Freight Charges: ₹ 0.00 (Ex Kolhapur - Freight Extra)</p>
            <p>Cash Discount: ₹ 0.00</p>
            <p>GST(18%): ₹ 58,364.14</p>
            <p>Round Off: ₹ 0.40</p>
            <Divider />
            <p><b>Total: ₹ 382,609.00</b></p>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <Divider />
      <div style={{ textAlign: "center" }}>
        <Text type="secondary">
          One Stop Solution for Variety of Branded Steel
        </Text>
        <br />
        <img
          src="https://i.imgur.com/mZTrYHY.png"
          alt="Steel Logos"
          style={{ maxHeight: 50 }}
        />
      </div>

      {/* Buttons */}
      <Row justify="end" style={{ marginTop: 20 }}>
        <Col>
          <Button type="default" onClick={() => window.history.back()} style={{ marginRight: 8 }}>
            Back
          </Button>
          <Button type="primary" onClick={() => window.print()}>
            Print
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default QuotationDetails;
