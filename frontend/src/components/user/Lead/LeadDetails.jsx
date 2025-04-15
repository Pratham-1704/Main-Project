import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Descriptions, Spin, message, Table, Row, Col, Typography, Divider } from "antd";
import dayjs from "dayjs";
import { Button } from "antd";

const { Title, Text } = Typography;

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
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

        setLead(leadRes.data.data);
        setCategories(catRes.data.data);
        setProducts(prodRes.data.data);
      } catch (err) {
        messageApi.error("Failed to fetch lead or supporting data");
      } finally {
        setLoading(false);
        localStorage.removeItem("selectedLeadId");
      }
    };

    fetchData();
  }, [id]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.name : id;
  };

  const getProductName = (id) => {
    const prod = products.find((p) => p._id === id);
    return prod ? prod.name : id;
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Req", dataIndex: "req", key: "req" },
    { title: "EstimationIn", dataIndex: "estimationin", key: "estimationin" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Narration", dataIndex: "narration", key: "narration" },
  ];

  const tableData = lead?.items?.map((item, index) => ({
    key: index,
    no: index + 1,
    category: getCategoryName(item.categoryid),
    product: getProductName(item.productid),
    estimationin : item.estimationin,
    brand: item.brand,
    req: item.req,
    unit: item.unit,
    quantity: item.quantity,
    narration: item.narration,
  })) || [];

  const totalWeight = tableData.reduce((acc, item) => acc + parseFloat(item.quantity || 0), 0);

  if (loading) return <Spin tip="Loading..." fullscreen />;
  if (!lead) return <div>No lead found.</div>;

  return (
    <section style={{ background: "#f0f2f5", padding: "20px", marginTop: "60px" }}>
      <div style={{ padding: "30px", marginLeft: "290px", background: "#fff" }}>
        {contextHolder}

        {/* Header */}
        <Row justify="center" align="middle" >
          <Col>
            <img src="https://th.bing.com/th/id/OIP.nOL8HH_1fafIVupyd9raegAAAA?rs=1&pid=ImgDetMain" alt="Logo" height={230} />
          </Col>
          <Col>
            <Title level={3} style={{ marginBottom: 0 ,color:"orange"}}>PARSHWANATH ISPAT PVT LTD</Title>
            <Text>120/1, P.B.Road, N.H.4, SHIROLI(P), KOLHAPUR</Text><br />
            <Text>Email - purchase@parshwanathsteel.com</Text><br />
            <Text>Tel - (0230) 2461285, 2460009 Mob - 96078 15933</Text><br />
            <Text><b>GSTIN</b>: 27AAFCP4825L1Z2</Text>
          </Col>
        </Row>

        <Divider />

        <Title level={4} style={{ textAlign: "center" }}>LEAD</Title>

        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Card title="Bill To">
              <Text strong>{lead.customername || "V AND G PIPE HOUSE"}</Text><br />
              <Text>8805263434</Text><br />
              <Text>GROUND, A-9, ZARINA TOWER, TALIGAO ROAD, ST INEZ PANAJI, North Goa, Goa, 403001</Text><br />
              <Text><b>GST No.:</b> 30AAFFV2278N1ZW</Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Ship To">
              <Text strong>{lead.customername || "V AND G PIPE HOUSE"}</Text><br />
              <Text>8805263434</Text><br />
              <Text>GROUND, A-9, ZARINA TOWER, TALIGAO ROAD, ST INEZ PANAJI, North Goa, Goa, 403001</Text><br />
              <Text><b>GST No.:</b> 30AAFFV2278N1ZW</Text>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Details">
              <p><b>Lead No :</b> {lead.leadno}</p>
              <p><b>Lead Date :</b> {dayjs(lead.leaddate).format("DD/MM/YYYY")}</p>
              <p><b>Payment Term :</b> Against Delivery</p>
              <p><b>Owner :</b> Deepak_Shinde</p>
              <p><b>CRM :</b> Deepak_Shinde</p>
            </Card>
          </Col>
        </Row>

        {/* Items Table */}
        <div style={{ marginTop: 30 }}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
          />
        </div>

        {/* Total Weight */}
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Text strong>Total Weight : {totalWeight.toFixed(1)} Kg</Text>
        </div>

        {/* Buttons Section */}
        <Row justify="end" gutter={16} style={{ marginTop: 20 }}>
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
            <Button type="dashed">
              SBQ
            </Button>
          </Col>
          <Col>
            <Button type="dashed">
              MBQ
            </Button>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default LeadDetails;
