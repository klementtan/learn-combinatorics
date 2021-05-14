import {
  Tag,
  Button,
  Form,
  InputNumber,
  Radio,
  Input,
  Row,
  Col,
  Tooltip,
  Typography,
  Modal,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { parseKatex } from '@/utils/Katex';
import { createAttemptSubmission, updateAttemptTime } from '@/services/attempt';
import { connect } from 'umi';
import * as moment from 'moment';
import { updateRoles } from '@/services/user';
import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined';
import { ACCESS_LEVELS, UserAccessLevelTag } from '@/components/Users/UsersAccessLevel';
import Select from 'antd/es/select';

function tagRender(props) {
  const { label, value, closable, onClose } = props;

  return <UserAccessLevelTag role={value} />;
}

const UpdateRoleModal = props => {
  const user = props.user;
  const [roles, setRoles] = useState([]);
  const [state, setState] = useState({
    visible: false,
    confirmLoading: false,
  });
  useEffect(() => {
    setRoles(user.roles.map((role, index) => role.name));
  }, []);

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const handleOk = async () => {
    setState({
      ...state,
      confirmLoading: true,
    });

    await updateRoles({ roles: roles }, user.id)
      .then(async response => {
        setState({
          ...state,
          confirmLoading: false,
        });
        props.fetchAllUsers();
      })
      .catch(error => {
        setState({
          ...state,
          confirmLoading: false,
        });
      });
  };

  const handleCancel = () => {
    setState({
      ...state,
      visible: false,
      status: null,
    });
  };

  const handleChange = newRoles => {
    setRoles(newRoles);
  };
  const { visible, confirmLoading } = state;
  return (
    <>
      <Button type="primary" icon={<SettingOutlined />} onClick={showModal}></Button>

      <Modal
        title="Access Levels"
        visible={visible}
        onOk={handleOk}
        okText={'Submit'}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Select
          mode="multiple"
          showArrow
          tagRender={tagRender}
          defaultValue={roles}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          {Object.keys(ACCESS_LEVELS).map(role =>
            <Select.Option
              value={role}
              key={role}
              disabled={ACCESS_LEVELS.PUBLIC_USER === role}
            >
              {role}
            </Select.Option>
          )}
        </Select>
      </Modal>
    </>
  );
};

export default UpdateRoleModal;
