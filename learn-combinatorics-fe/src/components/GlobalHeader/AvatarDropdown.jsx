import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = async (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      await dispatch({
        type: 'user/reset',
        payload: {  },
      });
      await dispatch({
        type: 'problems/reset',
        payload: {  },
      });
      await dispatch({
        type: 'lectures/reset',
        payload: {  },
      });
      await dispatch({
        type: 'hints/reset',
        payload: {  },
      });
      await dispatch({
        type: 'chapters/reset',
        payload: {  },
      });
      await dispatch({
        type: 'attempts/reset',
        payload: {  },
      });
      await dispatch({
        type: 'attempt/clear',
        payload: {  },
      });

      history.push('/user/login?action=logout')
      return;
    }

    history.push(`/profile`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      }, menu,} = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
          <Menu.Item key="profile">
            <UserOutlined />
            Profile
          </Menu.Item>
         <Menu.Divider />

        <Menu.Item key="logout">
          <LogoutOutlined />
          Logout
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name} | {currentUser.primary_email} {currentUser.nus_email && <>| {currentUser.nus_email}</>}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
