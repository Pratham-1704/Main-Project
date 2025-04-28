import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Select, Table, Button, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import "./Css Files/style.css";

const Parity = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [parityValues, setParityValues] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8081/brand");
      if (res.data.status === "success") {
        setBrands(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };

  const fetchProductsByBrand = async (brandId) => {
    try {
      const res = await axios.get("http://localhost:8081/brandproduct/products", {
        params: { brandid: brandId },
      });
      if (res.data.status === "success") {
        const updatedProducts = res.data.data.map((product, index) => ({
          key: index + 1,
          srno: index + 1,
          brand: brands.find((b) => b._id === brandId)?.name || "Unknown",
          product: product.name,
          productId: product._id,
          parity: "",
        }));
        setProducts(res.data.data);
        setTableData(updatedProducts);
      }
    } catch (err) {
      console.error("Error fetching products by brand", err);
    }
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
    fetchProductsByBrand(brandId);
  };

  const handleParityChange = (value, recordKey) => {
    const newData = tableData.map((item) =>
      item.key === recordKey ? { ...item, parity: value } : item
    );
    setTableData(newData);
  };

  const handleSubmit = () => {
    const payload = {
      parityName: form.getFieldValue("parityName"),
      rateDate: form.getFieldValue("rateDate"),
      brandId: selectedBrand,
      entries: tableData.map(({ productId, parity }) => ({
        productId,
        parity,
      })),
    };

    console.log("Submitting data:", payload);
    messageApi.success("Parity data ready for submission!");
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "srno",
      key: "srno",
      align: "center",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Parity",
      key: "parity",
      render: (_, record) => (
        <Input
          placeholder="Enter parity"
          value={record.parity}
          onChange={(e) => handleParityChange(e.target.value, record.key)}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Parity</h1>
        </div>
        <section className="section">
          <div className="card p-3">
            <Form form={form} layout="vertical">
              <div className="row">
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="parityName"
                    label="Parity"
                    rules={[{ required: true, message: "Please enter Parity name" }]}
                  >
                    <Input placeholder="Enter parity name (e.g., xyz)" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="rateDate"
                    label="Fixed Rate Date"
                    rules={[{ required: true, message: "Please select rate date" }]}
                  >
                    <DatePicker className="w-100" format="DD/MM/YYYY" />
                  </Form.Item>
                </div>
                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="brand"
                    label="Select Brand"
                    rules={[{ required: true, message: "Please select a brand" }]}
                  >
                    <Select
                      placeholder="Select a brand"
                      options={brands.map((b) => ({
                        value: b._id,
                        label: b.name,
                      }))}
                      onChange={handleBrandChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    Save Parity
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          {tableData.length > 0 && (
            <div className="card p-3 mt-3">
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Parity;
