import React, { useContext } from 'react';
import { Button } from 'antd';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';
import { logoutPlayer } from '~/api/auth';

const LogoutButton: React.FC = () => {
  const { setAuthenticated } = useContext(AuthenticationContext);

  const handleLogoutClick = (): void => {
    setAuthenticated(false);
    logoutPlayer();
  };

  return (
    <Button 
      key="logout-button"
      data-testid="logout-button-wrapper"
      onClick={handleLogoutClick}
      ghost
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
