import { Button, Tag, Input, Table, Space, Row, Col, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined } from '@ant-design/icons';
import { getAll } from '@/services/user';
import { ACCESS_LEVELS, tagNames, UserAccessLevelTag } from '@/components/Users/UsersAccessLevel';
import UpdateRoleModal from '@/pages/Admin/UsersManager/UpdateRoleModal';
const Users = () => {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  const searchInput = useRef(null);
  const fetchAllUsers = () => {
    getAll()
      .then(resp => {
        setUsers(resp.users);
      })
      .catch(error => {
        setUsers([]);
      });
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      colSpan: 1,
      width: '5%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name, record) => {
        return <Typography.Text>{name}</Typography.Text>;
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['name']
          ? record['name']
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={"Search User's Name"}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'title')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'name')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: 'Gmail',
      dataIndex: 'primary_email',
      render: (title, record) => {
        return <Typography.Text>{title}</Typography.Text>;
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['primary_email']
          ? record['primary_email']
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={"Search User's Gmail"}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'title')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'primary_email')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: 'NUS Email',
      dataIndex: 'nus_email',
      render: (title, record) => {
        return <Typography.Text>{title}</Typography.Text>;
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['nus_email']
          ? record['nus_email']
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={"Search User's Nus Email"}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'title')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'nus_email')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: 'Access Level',
      width: '10%',
      filters: Object.keys(ACCESS_LEVELS).map(function(key, index) {
        return {
          text: tagNames[key],
          value: key,
        };
      }),
      onFilter: (value, record) => {
        var roles = record.roles.map((role, index) => role.name);
        return roles.include(value);
      },
      render: user => {
        const roles = user.roles;
        return (
          <div>
            <Row>
              {roles.map((role, index) => (
                <Col key={index} style={{ marginBottom: '1em' }}>
                  {' '}
                  <UserAccessLevelTag role={role.name} />
                </Col>
              ))}
            </Row>
            <UpdateRoleModal user={user} fetchAllUsers={fetchAllUsers} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchAllUsers();
  }, []);
  /**
   * 国际化配置
   */

  return (
    <PageContainer>
      <Table
        bordered
        loading={users === null}
        dataSource={users}
        columns={columns}
        rowKey={record => record.id}
      />
    </PageContainer>
  );
};

export default Users;
