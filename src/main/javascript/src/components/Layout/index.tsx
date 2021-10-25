import React, { useContext } from 'react';
import { Layout as AntdLayout } from 'antd';
const { Content } = AntdLayout;
import { UserOutlined } from '@ant-design/icons';

import Header from './Header';
import Menu from './Menu';
import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';

import { LayoutProps } from './types';
import LogoutButton from './LogoutButton';
import styles from './Layout.module.scss';

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const { authenticated, user } = useContext(AuthenticationContext);

  return (
    <AntdLayout 
      className={styles.layout} 
      data-testid="layout-element"
    >
      <Header>
        { authenticated && (
          <>
            <div className={styles.menu}>
              <Menu />
            </div>
            <div className={styles.divider} />
            { user && 
              <div className={styles.userName}>
                <UserOutlined className={styles.userIcon} /> 
                { user?.firstname }
              </div>
            }
            <div className={styles.logoutButton}>
              <LogoutButton />
            </div>
          </>
        )}
      </Header>
      <Content className={styles.content}>
        { children }
      </Content>
    </AntdLayout>
  );
};

export default Layout;
