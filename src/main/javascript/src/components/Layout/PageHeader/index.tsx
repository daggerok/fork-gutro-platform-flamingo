import React from 'react';
import { Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { PageHeaderProps } from './types';

import styles from './PageHeader.module.scss';

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title,
  subtitle,
  backgroundHex = '#777777',
  backPath,
}: PageHeaderProps) => {

  const history = useHistory();

  const goBack = (): void => {
    if (backPath) { history.push(backPath); }
  };

  return (
    <header 
      className={styles.pageHeader}
      style={{backgroundColor: backgroundHex}}
    >
      <Row align="middle">
        { backPath &&  
          <Col span={1}>  
            <Button 
              type="default" 
              ghost
              shape="circle" 
              icon={<ArrowLeftOutlined />}
              onClick={goBack}
            />
          </Col>
        }
        <Col span={backPath? 21 : 24}><h1>{title}</h1></Col>
      </Row>
      { subtitle && 
        <Row>
          <Col 
            offset={backPath ? 1 : 0}
            span={24}
          >
            <p className={styles.subtitle}>{ subtitle }</p>
          </Col>
        </Row>
      }
    </header>  
  );
};

export default PageHeader;
