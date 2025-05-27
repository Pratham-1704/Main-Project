import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Table,
  Button,
  Card,
  message,
  Modal,
} from "antd";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;

const QuotationDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [quotation, setQuotation] = useState(null);
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal(); // <-- REQUIRED
  const navigate = useNavigate();

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

  const handleEdit = () => {
    localStorage.setItem("quotationId", id);
    localStorage.setItem("quotationDetail", id);
    navigate(`/quotation/modifyQtation/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    axios
      .get(`http://localhost:8081/quotation/${id}`)
      .then((res) => setQuotation(res.data.data))
      .catch(() => {
        messageApi.error("Failed to fetch quotation. Showing fallback data.");
        setQuotation(fallbackQuotation);
      });

    axios
      .get(`http://localhost:8081/quotationdetail/byquotation/${id}`)
      .then((res) => setQuotationDetails(res.data.data))
      .catch(() => {
        messageApi.error("Failed to fetch quotation details.");
      });
  }, [id]);

  const generatePDF = () => {
    const input = document.getElementById("quotation-print-area");
    const buttons = document.getElementById("pdf-buttons");

    if (buttons) buttons.style.display = "none";

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const blob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(
        blobUrl,
        "_blank",
        "width=900,height=700,left=100,top=100,scrollbars=yes,resizable=yes"
      );

      if (buttons) buttons.style.display = "flex";
    });
  };

  const createOrder = async () => {
    const payload = {
      quotationid: quotation._id,
      customerid: quotation.customerid?._id,
      orderno: `DO-${quotation.quotationno.split("-")[1]}`,
      orderdate: new Date().toISOString().split("T")[0],
      baddress: quotation.baddress,
      saddress: quotation.saddress,
      createdon: quotation.createdon,
      adminid: localStorage.getItem("adminid"),
      totalweight: 0,
      total: quotation.total,
      gstamount: quotation.gstamount,
      subtotal: quotation.subtotal,
    };

    console.log("Order Payload:", payload);
    const res = await axios.post("http://localhost:8081/order", payload);
    return res.data?.data?._id;
  };

  const createOrderDetails = async (orderid) => {
    const detailsPayload = quotationDetails.map((item) => ({
      orderid,
      brandid: item.brandid?._id,
      categoryid: item.categoryid?._id,
      productid: item.productid?._id,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      estimationin: item.estimationin,
      weight: item.weight,
      singleweight: item.singleweight,
      narration: item.narration,
    }));

    console.log("Order Details Payload:", detailsPayload);
    await axios.post("http://localhost:8081/orderDetail/", detailsPayload);
  };

  const handlePrepareDO = useCallback(() => {
    modal.confirm({
      title: "Are you sure you want to prepare the Delivery Order?",
      content: "This will generate an order based on the quotation.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          if (!quotation?.customerid?._id) {
            throw new Error("Customer information is missing");
          }

          const orderId = await createOrder();
          if (!orderId) {
            throw new Error("Failed to create order");
          }

          await createOrderDetails(orderId);

          // Update do_prepared status in quotation table
          await axios.patch(`http://localhost:8081/quotation/${quotation._id}`, {
            do_prepared: "yes",
          });

          localStorage.setItem("orderId", orderId);
          messageApi.success("Delivery Order prepared successfully!");
          // Redirect to dOrder page
          navigate(`/quotation/dOrder/${orderId}`);
        } catch (err) {
          console.error(err);
          messageApi.error(err.message || "Failed to prepare Delivery Order");
        } finally {
          setLoading(false);
        }
      },
    });
  }, [modal, quotation, quotationDetails, navigate]);

  if (!quotation) return null;

  return (
    <div className="container" style={{ padding: 0, marginLeft: 180 }}>
      {messageContextHolder}
      {modalContextHolder}
      <div
        style={{
          paddingTop: "60px",
          maxWidth: 850,
          margin: "auto",
          background: "#fff",
        }}
      >
        <div id="quotation-print-area" style={{ padding: 20 }}>
          <Divider style={{ margin: 0 }} />
          <Row align="middle" gutter={12}>
            <Col span={4}>
              <img src="/logo192.png" alt="Logo" style={{ maxHeight: 80 }} />
            </Col>
            <Col span={20}>
              <Title level={4} style={{ marginBottom: 0, color: "red" }}>
                PRITAM STEEL PVT LTD
              </Title>
              <Text>Nagaon, Kolhapur - 416122</Text>
              <br />
              <Text>
                Email: sales@pritamsteel.com / adminparshwa@gmail.com
              </Text>
              <br />
              <Text>Tel: (0230) 2461285, 2460009 Mob: 96078 15933</Text>
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
            <Col span={8}>
              <Text>
                <b>Quotation No:</b> {quotation.quotationno}
              </Text>
            </Col>
            <Col span={8}>
              <Text>
                <b>Date:</b> {quotation.quotationdate}
              </Text>
            </Col>
            <Col span={8}>
              <Text>
                <b>Type:</b> {quotation.quotationtype}
              </Text>
            </Col>
          </Row>

          <Table
            dataSource={quotationDetails}
            pagination={false}
            size="small"
            bordered
            rowKey="_id"
            columns={[
              { title: "No", render: (_, __, i) => i + 1 },
              {
                title: "Brand",
                dataIndex: "brandid",
                render: (_, r) => r.brandid?.name || "N/A",
              },
              {
                title: "Category",
                dataIndex: "categoryname",
                render: (_, r) => r.categoryname || r.categoryid?.name || "N/A",
              },
              {
                title: "Size",
                dataIndex: "size",
                render: (_, r) => r.productname || r.productid?.name || "N/A",
              },
              { title: "Narration", dataIndex: "narration" },
              { title: "Qty", dataIndex: "quantity" },
              { title: "Rate", dataIndex: "rate" },
              { title: "Amount", dataIndex: "amount" },
            ]}
          />

          <Row justify="end" style={{ marginTop: 20 }}>
            <Col span={8}>
              <Row justify="space-between">
                <Col>
                  <Text>Loading Charges:</Text>
                </Col>
                <Col>
                  <Text>₹{quotation.loadingCharges}</Text>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <Text>Cutting Charges:</Text>
                </Col>
                <Col>
                  <Text>₹{quotation.cuttingCharges}</Text>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <Text>Subtotal:</Text>
                </Col>
                <Col>
                  <Text>₹{quotation.subtotal}</Text>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <Text>GST (18%):</Text>
                </Col>
                <Col>
                  <Text>₹{quotation.gstamount}</Text>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col>
                  <Text strong>Total:</Text>
                </Col>
                <Col>
                  <Text strong>₹{quotation.total}</Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              One Stop Solution for Variety of Branded Steel
            </Text>
            <br />
            <img
              src="https://i.imgur.com/mZTrYHY.png"
              alt="Steel Logos"
              style={{ maxHeight: 40 }}
            />
          </div>
        </div>

        <Row
          justify="end"
          id="pdf-buttons"
          style={{ marginTop: 20, display: "flex", gap: 8 }}
        >
          <Button onClick={() => window.history.back()}>Back</Button>
          <Button type="dashed" onClick={handleEdit}>
            Edit
          </Button>
          <Button type="primary" onClick={handlePrepareDO} loading={loading}>
            Prepare D.O.
          </Button>
          <Button type="primary" onClick={generatePDF}>
            Generate PDF
          </Button>
        </Row>
      </div>
    </div>
  );
};

export default QuotationDetails;
