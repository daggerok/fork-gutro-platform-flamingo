import React, { useState, useContext } from 'react';
import { Spin, Form, Input, Button, Typography } from 'antd';
const { Text } = Typography;
import { Store } from 'antd/lib/form/interface';
import axios from 'axios';
import idx from 'idx';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';
import config from '~/config';

import styles from './LoginForm.module.scss';

type FormData = {
  username: string;
  password: string;
};

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const FORM_RULES = {
  username: [
    { required: true, message: 'Please input your username' },
  ],
  password: [
    { required: true, message: 'Please input your password' },
  ],
};

const LoginForm: React.FC = () => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ loginError, setLoginError ] = useState<string | null>(null);
  const { setAuthenticated } = useContext(AuthenticationContext);

  const onFinish = (values: Store): void => {
    setIsLoading(true);
    
    axios.post(`${config.apiPath}/authentication/`, {
      username: values.username,
      password: values.password,
    }, { timeout: 10000, withCredentials: true })
      .then((response) => {
        const user = idx(response, _ => _.data.user);
        if (user) {
          setLoginError(null);
          setAuthenticated(true);
        } else {
          const error = `Login failed\n${idx(response, _ => _.data.error)}`;
          setLoginError(error);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setLoginError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={FORM_RULES.username}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={FORM_RULES.password}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>

        { loginError && (
          <Form.Item className={styles.errorMessage}>
            <Text type="danger">
              { loginError }
            </Text>
          </Form.Item>
        )}
      </Form>
    </Spin>
  );
};

export default LoginForm;
