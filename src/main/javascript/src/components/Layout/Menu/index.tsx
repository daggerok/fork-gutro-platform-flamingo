import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import idx from 'idx';
import { Menu as AntdMenu } from 'antd';
import { EuroCircleOutlined, ScheduleOutlined } from '@ant-design/icons';

import { Role, Page } from '~/types';
import { hasRole } from '~/utils/role-check';
import { getFullPath } from  '~/utils/routes';

const { SubMenu } = AntdMenu;

const Menu: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('');

  const menuItems = [
    {
      title: 'Affiliates',
      icon: <EuroCircleOutlined />,
      show: hasRole(Role.AFFILIATE_READ) || hasRole(Role.AFFILIATE_WRITE),
      children: [
        {
          title: 'Affiliate List',
          url: getFullPath(Page.Affiliates),
          show: hasRole(Role.AFFILIATE_READ) || hasRole(Role.AFFILIATE_WRITE),
        },
        {
          title: 'Add New',
          url: getFullPath(Page.AffiliateEdit),
          show: hasRole(Role.AFFILIATE_WRITE),
        },
      ],
    },
    {
      title: 'Campaigns',
      icon: <ScheduleOutlined />,
      show: hasRole(Role.PROMOTION_SCHEDULING_READ) || hasRole(Role.PROMOTION_SCHEDULING_WRITE),
      children: [
        {
          title: 'Schedule Promotions',
          url: getFullPath(Page.ScheduleCampaigns),
          show: hasRole(Role.PROMOTION_SCHEDULING_READ) || hasRole(Role.PROMOTION_SCHEDULING_WRITE),
        },
      ],
    },
  ];

  const permittedMenuItems = menuItems.filter(menuItem => menuItem.show);

  const setSelectedMenuItemUrl = (): void => {
    const currentPathName = idx(global, (_) => _.window.location.pathname);
  
    menuItems.forEach((menuItem => {
      const matchingMenuItem = menuItem.children.find(child => child.url === currentPathName);
      if (matchingMenuItem) { setSelectedKey(matchingMenuItem?.url); }
    }));
  };

  useEffect(() => {
    setSelectedMenuItemUrl();
  }, []);

  return (
    <AntdMenu 
      theme="dark" 
      mode="horizontal" 
      style={{ width: 512 }}
      selectedKeys={[selectedKey]}
    >
      { permittedMenuItems.map((menuItem: any) => (
        <SubMenu 
          key={menuItem.title}
          title={menuItem.title}
          icon={menuItem.icon}
        > 
        {
          menuItem.children.map((child: any) => (
            <AntdMenu.Item 
              key={child.url}
              disabled={!child.show}
            >
              <Link to={child.url}>{child.title}</Link>
            </AntdMenu.Item>
          ))
        }
        </SubMenu>
      ))}
    </AntdMenu>
  );
};

export default Menu;
