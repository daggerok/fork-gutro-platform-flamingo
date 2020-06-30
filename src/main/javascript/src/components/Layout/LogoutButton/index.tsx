import React, { useContext } from 'react';
import axios from 'axios';
import { Menu } from 'antd';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';
import config from '~/config';

const LogoutButton: React.FC = () => {
  const { setAuthenticated } = useContext(AuthenticationContext);

  const handleLogoutClick = (): void => {
    setAuthenticated(false);
    axios.delete(`${config.apiPath}/authentication/`, { withCredentials: true }); // We don't really care if it works or not
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
    >
      <Menu.Item
        key="logout-button"
        onClick={handleLogoutClick}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default LogoutButton;
