import React from 'react';
import { Layout } from 'antd';
const { Header: AntdHeader } = Layout;

import styles from './Header.module.scss';
import logo from './logo.png';

type HeaderProps = {
  children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }: HeaderProps) => (
  <AntdHeader className={styles.header}>
    <img
      src={logo}
      className={styles.logo}
    />
    <span className={styles.title}>Flamingo</span>
    { children }
  </AntdHeader>
);

export default Header;
