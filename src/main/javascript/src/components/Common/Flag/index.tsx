import React from 'react';
import classnames from 'classnames';
import 'flag-icon-css/css/flag-icon.css';
import { FlagProps } from './types';

import styles from './index.module.scss';

const Flag: React.FC<FlagProps> = ({ country, isSmall }: FlagProps) => {
  if (!country) return null;

  return (
    <span
      data-testid="flag-component"
      className={classnames(
        styles.flagIcon,
        `flag-icon flag-icon-${country.toLowerCase()}`,
        isSmall && styles.smallIcon
      )}
    />
  );
};

export default Flag;
