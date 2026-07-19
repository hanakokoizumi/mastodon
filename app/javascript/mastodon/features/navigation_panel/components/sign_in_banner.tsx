import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { openModal } from 'mastodon/actions/modal';
import {
  registrationsOpen,
  sso_redirect,
  sso_login_path,
} from 'mastodon/initial_state';
import { useAppDispatch, useAppSelector } from 'mastodon/store';

export const SignInBanner: React.FC = () => {
  const dispatch = useAppDispatch();

  const openClosedRegistrationsModal = useCallback(
    () =>
      dispatch(
        openModal({ modalType: 'CLOSED_REGISTRATIONS', modalProps: {} }),
      ),
    [dispatch],
  );

  let signupButton: React.ReactNode;

  const signupUrl = useAppSelector(
    (state) => state.server.server.item?.registrations.url ?? '/auth/sign_up',
  );

  const ssoCombinedPath = sso_redirect ?? sso_login_path;

  if (ssoCombinedPath) {
    return (
      <div className='sign-in-banner'>
        <p>
          <strong>
            <FormattedMessage
              id='sign_in_banner.mastodon_is'
              defaultMessage='On Nightcord, the late-night conversation never really ends.'
            />
          </strong>
        </p>
        <p>
          <FormattedMessage
            id='sign_in_banner.follow_anyone'
            defaultMessage='Follow anyone across the fediverse and read it all in order. No algorithms, ads, or clickbait—just time, flowing quietly.'
          />
        </p>
        <a
          href={ssoCombinedPath}
          data-method='post'
          className='button button--block button-secondary'
        >
          <FormattedMessage
            id='sign_in_banner.sign_in'
            defaultMessage='Login'
          />
          {'/'}
          <FormattedMessage
            id='sign_in_banner.create_account'
            defaultMessage='Create account'
          />
        </a>
      </div>
    );
  }

  if (registrationsOpen) {
    signupButton = (
      <a href={signupUrl} className='button button--block'>
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </a>
    );
  } else {
    signupButton = (
      <button
        className='button button--block'
        onClick={openClosedRegistrationsModal}
        type='button'
      >
        <FormattedMessage
          id='sign_in_banner.create_account'
          defaultMessage='Create account'
        />
      </button>
    );
  }

  return (
    <div className='sign-in-banner'>
      <p>
        <strong>
          <FormattedMessage
            id='sign_in_banner.mastodon_is'
            defaultMessage='On Nightcord, the late-night conversation never really ends.'
          />
        </strong>
      </p>
      <p>
        <FormattedMessage
          id='sign_in_banner.follow_anyone'
          defaultMessage='Follow anyone across the fediverse and read it all in order. No algorithms, ads, or clickbait—just time, flowing quietly.'
        />
      </p>
      {signupButton}
      <a href='/auth/sign_in' className='button button--block button-secondary'>
        <FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Login' />
      </a>
    </div>
  );
};
