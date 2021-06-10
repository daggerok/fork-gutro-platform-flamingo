import React from 'react';
import classnames from 'classnames';
import 'flag-icon-css/css/flag-icon.css';
import { FlagProps } from './types';

import styles from './index.module.scss';

const Flag: React.FC<FlagProps> = ({
  country,
}: FlagProps) => {
  if (!country) return null;
  return (
    <span
      className={classnames(
        styles.flagIcon,
        `flag-icon flag-icon-${country.toLowerCase()}`
      )}
    />
  );
};

export default Flag;
