import React from 'react';

import Layout from '~/components/Layout';

import LoginForm from './LoginForm';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  return (
    <Layout>
      <main className={styles.main}>
        <LoginForm />
      </main>
    </Layout>
  );
};

export default Login;
