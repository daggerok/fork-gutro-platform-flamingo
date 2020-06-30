import React, { useState, useEffect } from 'react';
import idx from 'idx';
// import Link from 'next/link';

import { Menu as AntdMenu } from 'antd';

const menuItems = [
  {
    title: '.CSV sending',
    url: '/csv-upload',
  },
];

const getSelectedMenuItemUrl = (): string | null => {
  const currentPathName = idx(global, _ => _.window.location.pathname);
  const selectedMenuItem = menuItems.find(menuItem => menuItem.url === currentPathName);

  if (selectedMenuItem) {
    return selectedMenuItem.url;
  }

  return null;
};

const Menu: React.FC = () => {
  const [ selectedKey, setSelectedKey ] = useState<string | null>(null);

  useEffect(() => {
    const newSelectedKey = getSelectedMenuItemUrl();
    if (newSelectedKey !== selectedKey) {
      setSelectedKey(newSelectedKey);
    }
  });
  
  return (
    <AntdMenu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey || '']}
    >
      { menuItems.map(menuItem => (
        <AntdMenu.Item key={menuItem.url}>
          {/* <Link href={menuItem.url}>
            <a>{ menuItem.title }</a>
          </Link>   */}
        </AntdMenu.Item>
      ))}
    </AntdMenu>
  );
};

export default Menu;
