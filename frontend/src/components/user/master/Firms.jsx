import React, { useState, useEffect } from "react";
import { Button, Input, message, Table } from "antd";
import axios from "axios";
import "./Css Files/style.css"; // Import the custom CSS file

function Firms() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gstno: "",
    contactno: "",
    bankname: "",
    accountno: "",
    ifsccode: "",
  });

  const [firms, setFirms] = useState([]); // Store firms data
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch firms from the backend
  const fetchFirms = async () => {
    try {
      const response = await axios.get("http://localhost:8081/firm");
      setFirms(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching firms:", error);
      messageApi.open({ type: "error", content: "Failed to fetch firms!" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFirms();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.gstno ||
      !formData.contactno ||
      !formData.bankname ||
      !formData.accountno ||
      !formData.ifsccode
    ) {
      messageApi.open({ type: "error", content: "All fields are required!" });
      return;
    }

    try {
      await axios.post("http://localhost:8081/firm", formData);
      messageApi.open({ type: "success", content: "Firm saved successfully!" });
      fetchFirms(); // Refresh firms list
      setFormData({
        name: "",
        address: "",
        gstno: "",
        contactno: "",
        bankname: "",
        accountno: "",
        ifsccode: "",
      }); // Reset form
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to save firm!" });
      console.error("Error:", error);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a category to update!" });
      return;
    }
  
    try {
      await axios.put(`http://localhost:8081/firm/${formData._id}`, formData);
      messageApi.open({ type: "success", content: "Firms updated successfully!" });
      fetchFirms(); // Refresh categories list
      clearForm();
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to update firms!" });
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!formData._id) {
      messageApi.open({ type: "error", content: "Select a firm to delete!" });
      return;
    }

    try {
      await axios.delete(`http://localhost:8081/firms/${formData._id}`);
      messageApi.open({ type: "success", content: "Firm deleted successfully!" });
      fetchFirms(); // Refresh firms list
      setFormData({
        name: "",
        address: "",
        gstno: "",
        contactno: "",
        bankname: "",
        accountno: "",
        ifsccode: "",
      }); // Reset form
    } catch (error) {
      messageApi.open({ type: "error", content: "Failed to delete firm!" });
      console.error("Error:", error);
    }
  };

  //clear form
    const clearForm = () => {
        setFormData({
            name: "",
            address: "",
            gstno: "",
            contactno: "",
            bankname: "",
            accountno: "",
            ifsccode: "",
        });
    };

    
  // Table columns configuration
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "GST No", dataIndex: "gstno", key: "gstno" },
    { title: "Contact No", dataIndex: "contactno", key: "contactno" },
    { title: "Bank Name", dataIndex: "bankname", key: "bankname" },
    { title: "Account No", dataIndex: "accountno", key: "accountno" },
    { title: "IFSC Code", dataIndex: "ifsccode", key: "ifsccode" },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Firm Management</h1>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <div className="row">
                  <div className="col-lg-6 p-1">
                    Name*
                    <Input
                      name="name"
                      placeholder="Firm Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Address*
                    <Input
                      name="address"
                      placeholder="Firm Address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    GST No*
                    <Input
                      name="gstno"
                      placeholder="GST Number"
                      value={formData.gstno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Contact No*
                    <Input
                      name="contactno"
                      placeholder="Contact Number"
                      value={formData.contactno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Bank Name*
                    <Input
                      name="bankname"
                      placeholder="Bank Name"
                      value={formData.bankname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    Account No*
                    <Input
                      name="accountno"
                      placeholder="Account Number"
                      value={formData.accountno}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6 p-1">
                    IFSC Code*
                    <Input
                      name="ifsccode"
                      placeholder="IFSC Code"
                      value={formData.ifsccode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-12 p-1">
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                      color="green"
                      variant="solid"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={handleDelete}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="solid"
                      onClick={() =>
                        setFormData({
                          name: "",
                          address: "",
                          gstno: "",
                          contactno: "",
                          bankname: "",
                          accountno: "",
                          ifsccode: "",
                        })
                      }
                      style={{ marginRight: "10px" }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card p-3">
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={firms}
                  rowKey="_id"
                  onRow={(record) => ({
                    onClick: () => {
                      setFormData(record); // Populate form with selected row data
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Firms;
