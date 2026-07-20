import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import { domain, sso_redirect, sso_login_path } from 'mastodon/initial_state';

import classes from '../styles.module.scss';

export const Header = () => {
  const ssoCombinedPath = sso_redirect ?? sso_login_path;

  return (
    <div className={classes.minimalHeader}>
      <div className={classes.leftSide}>
        <Link to='/overview'>{domain}</Link>
      </div>

      <div className={classes.rightSide}>
        <a
          href={ssoCombinedPath ?? '/auth/sign_in'}
          data-method={ssoCombinedPath ? 'post' : undefined}
          className='button button-secondary'
        >
          <FormattedMessage
            id='sign_in_banner.sign_in'
            defaultMessage='Login'
          />
        </a>
      </div>
    </div>
  );
};
