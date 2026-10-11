import { defineMessages, useIntl } from 'react-intl';

import { Icon } from '@/mastodon/components/icon';
import MatrixIcon from '@/mastodon/nightcord/icons/matrix.svg?react';

const messages = defineMessages({
  nightChat: {
    id: 'navigation_bar.night_chat',
    defaultMessage: 'Night chat',
  },
});

export const NightChatLink = () => {
  const intl = useIntl();

  return (
    <a
      className='column-link column-link--transparent'
      href='https://chat.nightcord.de'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Icon id='matrix' icon={MatrixIcon} className='column-link__icon' />
      <span>{intl.formatMessage(messages.nightChat)}</span>
    </a>
  );
};
