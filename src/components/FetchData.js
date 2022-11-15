import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input } from "antd";
import { isEmpty } from "lodash";

const FetchData = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  let [filteredInfo, setFilteredInfo] = useState({});
  let [filteredData] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await axios.get(
      "https://skolado-backend.herokuapp.com/coding-challenge/all-records?name=skolado"
    );
    setGridData(response.data);
    setLoading(false);
  };

  const handleDelete = (value) => {
    const dataSource = [...modifiedData];
    const filteredData = dataSource.filter((item) => item.id !== value.id);
    setGridData(filteredData);
  };

  const modifiedData = gridData.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    info: `My name is ${item.email.split("@")[0]} and i am ${Math.floor(
      Math.random() * 6
    ) + 20} year old`,
    age: Math.floor(Math.random() * 6) + 20,
    comment: isEmpty(body) ? item.comment : body,
  }));

  const handleChange = (_, filters, sorter) => {
    setFilteredInfo(filters);
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    const input = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please input ${title}`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      editable: true,
    },

    {
      title: "Subject",
      dataIndex: "subject",
      align: "center",
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1 ? (
          <Space>
            <Popconfirm onClick={() => handleDelete(record)}>
              <button type="button" disabled={editable} class="btn btn-danger">
                Delete
              </button>
            </Popconfirm>
          </Space>
        ) : null;
      },
    },
  ];

  const isEditing = (record) => {
    return record.key === editingKey;
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      loadData();
    }
  };
  const globalSearch = () => {
    filteredData = modifiedData.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.email.toLowerCase().includes(searchText.toLowerCase()) ||
        value.subject.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setGridData(filteredData);
  };

  return (
    <div className="layout">
      <h1 className="header-skolado">Skolado</h1>
      <Space className="search-group" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Enter Search Text"
          onChange={handleSearch}
          type="text"
          value={searchText}
        />
        <Button type="primary" onClick={globalSearch}>
          Search
        </Button>
      </Space>
      <Form form={form} component={false}>
        <Table
          className="table-group"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={
            filteredData && filteredData.length ? filteredData : modifiedData
          }
          bordered
          loading={loading}
          onChange={handleChange}
        />
      </Form>
    </div>
  );
};

export default FetchData;
