import React, { useContext } from 'react';
import { Menu } from 'antd';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';
import { logoutPlayer } from '~/api/auth';

const LogoutButton: React.FC = () => {
  const { setAuthenticated } = useContext(AuthenticationContext);

  const handleLogoutClick = (): void => {
    setAuthenticated(false);
    logoutPlayer();
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
