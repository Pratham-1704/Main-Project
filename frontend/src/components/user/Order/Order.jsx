import React, { useEffect, useRef, useState } from "react";
import { Table, Descriptions, Typography, Divider, Button, Spin, message } from "antd";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;

const Order = () => {
  const printRef = useRef();
  const [orderDetails, setOrderDetails] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this with actual Order ID
  const orderId = "ORDER_ID";  

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/order/${orderId}`);
        setOrderDetails(data.orderDetails);
        setCustomer(data.customer);
        setItems(data.items);
      } catch (err) {
        message.error("Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const columns = [
    { title: "No", dataIndex: "key", key: "key" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Req", dataIndex: "req", key: "req" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Producer", dataIndex: "producer", key: "producer" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
  ];

  const getTotalWeight = () => {
    return items.reduce((sum, item) => {
      const weight = parseFloat(item.quantity);
      return sum + (isNaN(weight) ? 0 : weight);
    }, 0).toFixed(1);
  };

  const handleDownload = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order-${orderDetails?.orderNo || "print"}.pdf`);
    });
  };

  if (loading) return <Spin tip="Loading..." style={{ marginTop: 100 }} />;

  return (
    <div>
      <Button type="primary" onClick={handleDownload} style={{ marginBottom: 20 }}>
        Download PDF
      </Button>
      <div ref={printRef} style={{ background: "#fff", padding: 24 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          PRITAM STEEL PVT LTD
        </Title>
        <Text style={{ display: "block", textAlign: "center" }}>
          Nagaon, Kolhapur-416122 | sales@pritamsteel.com | Mob: 96078 15933
        </Text>
        <Text style={{ display: "block", textAlign: "center", marginBottom: 10 }}>
          GSTIN - 27AALCP1877G1Z1
        </Text>
        <Divider />
        <Title level={4} style={{ textAlign: "center" }}>
          DELIVERY ORDER
        </Title>

        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Bill To">
            <b>{customer.name}</b> <br />
            {customer.address} <br />
            📞 {customer.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Ship To">
            <b>{customer.name}</b> <br />
            {customer.address} <br />
            📞 {customer.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Order No">
            {orderDetails.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="D. D. Date">
            {orderDetails.ddDate}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Mode">
            {orderDetails.paymentMode}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Term">
            {orderDetails.paymentTerm}
          </Descriptions.Item>
          <Descriptions.Item label="Owner">
            {orderDetails.owner}
          </Descriptions.Item>
          <Descriptions.Item label="CRM">
            {orderDetails.crm}
          </Descriptions.Item>
        </Descriptions>

        <Divider />
        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6}>
                <b>Total wt.</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                <b>{getTotalWeight()} Kgs</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          )}
        />

        <Divider />
        <div style={{ marginTop: 16 }}>
          <Text>Loading Charges: <b>Yes</b></Text> <br />
          <Text>Freight Charges: <b>Ex Kolhapur - Freight Extra</b></Text> <br />
          <Text>Cutting Charges: <b>0 ₹</b></Text> <br />
          <Text>C.D.: <b>0 ₹</b></Text>
        </div>

        <div style={{ textAlign: "right", marginTop: 40 }}>
          <Text>For <b>PRITAM STEEL PVT LTD</b></Text>
        </div>
      </div>
    </div>
  );
};

export default Order;
