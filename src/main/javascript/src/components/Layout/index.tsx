import React, { useContext } from 'react';
import { Layout as AntdLayout } from 'antd';
const { Content } = AntdLayout;

import Header from './Header';
import Menu from './Menu';
import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';


import styles from './Layout.module.scss';
import LogoutButton from './LogoutButton';

type LayoutProps = {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  const { authenticated } = useContext(AuthenticationContext);

  return (
    <AntdLayout className={styles.layout}>
      <Header>
        { authenticated && (
          <>
            <div className={styles.menu}>
              <Menu />
            </div>
            <div className={styles.divider} />
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
