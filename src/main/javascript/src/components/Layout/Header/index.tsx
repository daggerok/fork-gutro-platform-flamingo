import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
const { Header: AntdHeader } = Layout;
import EnvironmentFlag from '~/components/Common/EnvironmentFlag';
import { HeaderProps } from '../types';
import { getFullPath } from  '~/utils/routes';
import { Page } from '~/types';
import styles from './Header.module.scss';
import logo from './logo.png';

const Header: React.FC<HeaderProps> = ({ children }: HeaderProps) => (
  <AntdHeader className={styles.header}>
    <Link to={getFullPath(Page.Landing)}>
      <img
        src={logo}
        className={styles.logo}
      />
      <span className={styles.title}>Flamingo</span>
    </Link> 
    <div className={styles.flagContainer}>
      <EnvironmentFlag />
    </div>
    { children }
  </AntdHeader>
);

export default Header;
