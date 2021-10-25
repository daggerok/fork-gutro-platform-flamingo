import React from 'react';
import { Layout } from 'antd';
const { Header: AntdHeader } = Layout;
import EnvironmentFlag from '~/components/Common/EnvironmentFlag';
import { HeaderProps } from '../types';
import styles from './Header.module.scss';
import logo from './logo.png';

const Header: React.FC<HeaderProps> = ({ children }: HeaderProps) => (
  <AntdHeader 
    data-testid="header"
    className={styles.header}
  >
    <img
      src={logo}
      data-testid="header-logo"
      className={styles.logo}
    />
    <span 
      data-testid="header-title"
      className={styles.title}
    >
      Flamingo
    </span>
    <div 
      data-testid="header-flag-container"
      className={styles.flagContainer}
    >
      <EnvironmentFlag />
    </div>
    { children }
  </AntdHeader>
);

export default Header;
