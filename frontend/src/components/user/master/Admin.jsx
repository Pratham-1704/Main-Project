import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, message, Table, Popconfirm, Form, Upload } from "antd";
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Css Files/style.css";

const Admin = () => {
  const [form] = Form.useForm();
  const [adminList, setAdminList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8081/admin");
      setAdminList(res.data.status === "success" ? res.data.data : []);
    } catch (error) {
      messageApi.error("Failed to fetch admin list!");
      setAdminList([]);
    }
  };

  let debounceTimer = null;

  const getTimedValidator = (field, message, extraCheck = null) => ({
    validator: async (_, value) => {
      if (!value || (extraCheck && !extraCheck(value))) {
        setTimeout(() => {
          form.setFields([{ name: field, errors: [] }]);
        }, 5000);
        return Promise.reject(new Error(message));
      }
      if (field === "username") {
        return new Promise((resolve, reject) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(async () => {
            try {
              const res = await axios.get("http://localhost:8081/admin/check-username", {
                params: { username: value },
              });
              const isSameAsOriginal = value === initialValues?.username;
              if (res.data.exists && !isSameAsOriginal) {
                setTimeout(() => {
                  form.setFields([{ name: field, errors: [] }]);
                }, 5000);
                reject(new Error("Username already exists!"));
              } else {
                resolve();
              }
            } catch (err) {
              reject(new Error("Username check failed. Try again!"));
            }
          }, 300);
        });
      }
      return Promise.resolve();
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === "profilePic" && values.profilePic && values.profilePic.length > 0) {
          // Only append if a new file is selected or changed
          if (values.profilePic[0].originFileObj) {
            formData.append("profilePic", values.profilePic[0].originFileObj);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      if (editingId) {
        const isChanged = Object.keys(values).some(
          (key) => values[key]?.toString().trim() !== initialValues?.[key]?.toString().trim()
        );
        if (!isChanged && !values.profilePic) {
          messageApi.info("No changes made.");
          return;
        }
        await axios.put(`http://localhost:8081/admin/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        messageApi.success("Admin updated successfully!");
        setEditingId(null);
        setInitialValues(null);
      } else {
        await axios.post("http://localhost:8081/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        messageApi.success("Admin added successfully!");
      }
      form.resetFields();
      fetchAdmins();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Please fill the values correctly!";
      messageApi.error(errorMsg);
    }
  };

  const handleEdit = (record) => {
    window.scrollTo(0, 0);
    form.setFieldsValue({
      ...record,
      profilePic: record.profilePic
        ? [
            {
              uid: "-1",
              name: "Profile Pic",
              status: "done",
              url: `http://localhost:8081${record.profilePic}`,
            },
          ]
        : [],
    });
    setEditingId(record._id);
    setInitialValues(record);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/admin/${id}`);
      messageApi.success("Admin deleted successfully!");
      fetchAdmins();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete admin!";
      messageApi.error(errorMsg);
    }
  };

  const clearForm = () => {
    form.resetFields();
    setEditingId(null);
    setInitialValues(null);
  };

  const columns = [
    {
      title: "Profile Pic",
      dataIndex: "profilePic",
      key: "profilePic",
      render: (pic) =>
        pic ? (
          <img
            src={`http://localhost:8081${pic}`}
            alt="Profile"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
            onError={e => { e.target.onerror = null; e.target.src = "/default-profile.png"; }}
          />
        ) : (
          "—"
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Mobile No", dataIndex: "mobileno", key: "mobileno" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-button edit-button"
          />
          <Popconfirm
            title="Are you sure you want to delete this admin?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              className="action-button delete-button"
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Admins</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="">Dashboard</Link></li>
              <li className="breadcrumb-item active">Admin</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="card p-3" >
            <Form form={form} layout="vertical" encType="multipart/form-data">
              <div className="row">
                {[{ name: "name", label: "Name" },
                { name: "username", label: "Username" },
                { name: "password", label: "Password" },
                { name: "mobileno", label: "Mobile No" }
                ].map(({ name, label }) => (
                  <div className="col-lg-6 p-1" key={name}>
                    <Form.Item
                      name={name}
                      label={label}
                      rules={[getTimedValidator(name, `Please enter ${label.toLowerCase()}!`)]}
                    >
                      <Input placeholder={label} />
                    </Form.Item>
                  </div>
                ))}

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="role"
                    label="Role"
                    rules={[getTimedValidator("role", "Please select role!")]}
                  >
                    <Select
                      placeholder="Select Role"
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "user", label: "User" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[getTimedValidator("status", "Please select status!")]}
                  >
                    <Select
                      placeholder="Select Status"
                      options={[
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <div className="col-lg-6 p-1">
                  <Form.Item
                    name="profilePic"
                    label="Profile Picture"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                  >
                    <Upload
                      name="profilePic"
                      listType="picture"
                      beforeUpload={() => false}
                      maxCount={1}
                      accept="image/*"
                      defaultFileList={[]}
                    >
                      <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                  </Form.Item>
                </div>

                <div className="col-lg-12 p-1">
                  <Button type="primary" onClick={handleSubmit}>
                    {editingId ? "Update" : "Save"}
                  </Button>
                  <Button onClick={clearForm} style={{ marginLeft: 10 }}>
                    {editingId ? "Cancel" : "Clear"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div className="card p-3 custom-table">
            <Table
              columns={columns}
              dataSource={adminList}
              rowKey="_id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Admin;
