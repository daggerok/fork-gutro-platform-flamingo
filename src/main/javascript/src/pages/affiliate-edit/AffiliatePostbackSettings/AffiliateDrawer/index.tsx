import React, { useState } from 'react';
import { Drawer, Button, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import styles from './AffiliateDrawer.module.scss';

const { Paragraph } = Typography;

const AffiliateDrawer: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const variables = [
    '{$leo_accountid}',
    '{$leo_affiliateid}',
    '{$leo_pid}',
    '{$leo_depositamount}',
    '{$leo_currency}',
  ];

  const showDrawer = (): void => {
    setVisible(true);
  };

  const onClose = (): void => {
    setVisible(false);
  };

  return (
    <>
      <Button 
        className={styles.drawerButton}
        type="default" 
        onClick={showDrawer}
        icon={<InfoCircleOutlined />}
        size="small"
      >
       Placeholder cheat sheet
      </Button>
      <Drawer
        title="Placeholder cheat sheet"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className={styles.variableContainer}>
          { variables.map((variable: string, index: number) => {
            return(
              <code 
                key={index}
                className={styles.variableElement}
              >
                <Paragraph copyable>{variable}</Paragraph>
              </code>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default AffiliateDrawer;