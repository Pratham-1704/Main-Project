import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Form,
  DatePicker,
  Row,
  Col,
  Spin,
  Select,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const fallbackOrder = {
  customername: "N/A",
  address: "N/A",
  orderdate: null,
  orderno: "N/A",
  items: [],
};

const DOrder = () => {
  // Support both /quotation/dOrder/:orderId and fallback to localStorage
  let { orderId, id } = useParams();
  orderId = orderId || id || localStorage.getItem("orderId");
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState(fallbackOrder);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noOrderId, setNoOrderId] = useState(false);

  // Ant Design message API
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!orderId) {
      setNoOrderId(true);
      setLoading(false);
      return;
    }
    const fetchOrderAndDetails = async () => {
      try {
        // Fetch order main data
        const orderRes = await axios.get(`http://localhost:8081/order/${orderId}`);
        let order = orderRes.data.data || fallbackOrder;

        // If customername or address missing, fetch customer
        if ((!order.customername || !order.address) && order.customerid) {
          try {
            const custRes = await axios.get(`http://localhost:8081/customer/${order.customerid._id}`);
            const customer = custRes.data.data;
            order = {
              ...order,
              customername: customer?.name || fallbackOrder.customername,
              address: customer?.address || fallbackOrder.address,
            };
          } catch {
            // If customer fetch fails, fallback
            order = {
              ...order,
              customername: fallbackOrder.customername,
              address: fallbackOrder.address,
            };
          }
        }

        setOrderData(order);

        // Fill form fields with fallback values
        form.setFieldsValue({
          customer: order.customername || fallbackOrder.customername,
          address: order.address || fallbackOrder.address,
          orderdate: order.orderdate ? dayjs(order.orderdate) : null,
          orderno: order.orderno || fallbackOrder.orderno,
        });

        // Fetch order details from orderDetails table
        const detailsRes = await axios.get(`http://localhost:8081/orderDetail/byorder/${orderId}`);
        const details = Array.isArray(detailsRes.data.data) ? detailsRes.data.data : [];

        // Map orderDetails to table rows
        const tableRows = details.map((item, idx) => ({
          key: item._id || `row-${idx}`,
          category: item.categoryname || (item.categoryid?.name ?? "N/A"),
          product: item.productname || (item.productid?.name ?? "N/A"),
          brand: item.brandname || (item.brandid?.name ?? "N/A"),
          req: item.quantity ?? "",
          estimationin: item.estimationin || "N/A",
          rate: item.rate ?? "",
          total: item.amount ?? "",
          narration: item.narration || "",
          singleweight: item.singleweight ?? "", // <-- ADD THIS
          weight: item.weight ?? "",             // <-- ADD THIS
        }));
        setTableData(tableRows);
      } catch (err) {
        messageApi.error("Failed to load order or order details data");
        setOrderData(fallbackOrder);
        setTableData([]);
        form.setFieldsValue({
          customer: fallbackOrder.customername,
          address: fallbackOrder.address,
          orderdate: null,
          orderno: fallbackOrder.orderno,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndDetails();
  }, [orderId, form, messageApi]);

  const updateRow = (key, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.key === key
          ? {
            ...row,
            [field]: value,
            total:
              field === "rate" || field === "req"
                ? (parseFloat(field === "rate" ? value : row.rate) || 0) *
                (parseFloat(field === "req" ? value : row.req) || 0)
                : row.total,
          }
          : row
      )
    );
  };

  const deleteRow = (key) => {
    setTableData((prev) => prev.filter((row) => row.key !== key));
  };

  const calculateTotalSum = () => {
    return tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      // Get updated form values
      const formValues = form.getFieldsValue();

      // Calculate new subtotal, gstamount, total
      const subtotal = tableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
      const gstamount = subtotal * 0.18;
      const total = subtotal + gstamount;
      const totalweight = tableData.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0);

      // Prepare order payload
      const orderPayload = {
        ...orderData,
        customername: formValues.customer,
        address: formValues.address,
        orderdate: formValues.orderdate ? formValues.orderdate.format("YYYY-MM-DD") : orderData.orderdate,
        orderno: formValues.orderno,
        subtotal,
        gstamount,
        total,
        totalweight // <-- ADD THIS

      };
      // Prepare order details payload
      const detailsPayload = tableData.map(row => ({
        _id: row.key,
        orderid: orderId,
        categoryname: row.category,
        productname: row.product,
        brandname: row.brand,
        quantity: row.req,
        estimationin: row.estimationin,

        rate: row.rate,
        amount: row.total,
        narration: row.narration,
        paymentMode: formValues.paymentMode,
        singleweight: row.singleweight, // <-- ADD THIS
        weight: row.weight,             // <-- ADD THIS
      }));

      // Update order
      await axios.put(`http://localhost:8081/order/${orderId}`, orderPayload);

      console.log("Order updated successfully:", orderPayload);
      // Update order details (assuming batch update endpoint)
      await axios.put(`http://localhost:8081/orderDetail/byorder/${orderId}`, detailsPayload);
      console.log("Order details updated successfully:", detailsPayload);

      messageApi.success("Order and details updated successfully!");
    } catch (err) {
      messageApi.error("Failed to update order or order details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spin tip="Loading..." style={{ marginTop: 100 }} />;

  if (noOrderId) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>No Order ID found.</h2>
        <p>Please access this page from the Quotation or Order workflow.</p>
      </div>
    );
  }

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Req",
      dataIndex: "req",
      key: "req",
      render: (_, record) => (
        <Input
          value={record.req}
          onChange={(e) => updateRow(record.key, "req", e.target.value)}
        />
      ),
    },
    {
      title: "Unit",
      dataIndex: "estimationin",
      key: "estimationin",
      render: (text) => (
        <Input value={text} readOnly style={{ backgroundColor: "#f5f5f5" }} />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (_, record) => (
        <Input
          value={record.rate}
          onChange={(e) => updateRow(record.key, "rate", e.target.value)}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => <Input value={text} readOnly />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <main id="main" className="main">
      {contextHolder}
      <div className="pagetitle">
        <h1>Delivery Order</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/order/list">Order</Link>
            </li>
            <li className="breadcrumb-item active">Delivery Order</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="card p-3 mt-3">
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Customer" name="customer">
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Address" name="address">
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  label="Payment Mode"
                  name="paymentMode"
                  rules={[{ required: true, message: 'Please select a payment method' }]}
                >
                  <Select placeholder="Select payment method">
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="cheque">Cheque</Select.Option>
                    <Select.Option value="neft/rtgs">NEFT/RTGS</Select.Option>
                    <Select.Option value="against delivery">Against Delivery</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item label="Order Date" name="orderdate">
                  <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Order No" name="orderno">
                  <Input readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="card p-3 mt-3">
          <Table
            dataSource={tableData}
            columns={columns}
            rowKey="key"
            pagination={false}
            footer={() => (
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Total Sum: {calculateTotalSum()}
              </div>
            )}
          />
          <div className="text-end mt-2">
            <Link to="/quotation/quotations">
            <Button
              type="primary"
              style={{ marginRight: "8px", marginTop: "8px" }}
              onClick={handleUpdate}
              loading={loading}
            >
              Submit
            </Button>
            </Link>
            {/* <Link to="/quotation/quotations">
              <Button type="default" danger style={{ marginTop: "8px" }}>
                Cancel
              </Button>
            </Link> */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DOrder;