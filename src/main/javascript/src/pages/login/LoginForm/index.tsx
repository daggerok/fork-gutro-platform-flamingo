import React, { useState, useContext } from 'react';
import { Spin, Form, Input, Button, Typography } from 'antd';
const { Text } = Typography;
import { Store } from 'antd/lib/form/interface';
import idx from 'idx';

import { AuthenticationContext } from '~/components/Authentication/AuthenticationContextProvider';
import { loginPlayer } from '~/api/auth';
import { LAYOUT, TAIL_LAYOUT, FORM_RULES } from './constants';

import styles from './LoginForm.module.scss';

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { setAuthenticated } = useContext(AuthenticationContext);

  const onFinish = (values: Store): void => {
    setIsLoading(true);

    loginPlayer(values.username, values.password)
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
        {...LAYOUT}
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

        <Form.Item {...TAIL_LAYOUT}>
          <Button
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>

        {loginError && (
          <Form.Item className={styles.errorMessage}>
            <Text type="danger">{loginError}</Text>
          </Form.Item>
        )}
      </Form>
    </Spin>
  );
};

export default LoginForm;
