import { defineMessages, useIntl } from 'react-intl';

import classNames from 'classnames';

import projectSekaiLogo from '@/images/project-sekai-logo.png';
import { CopyIconButton } from '@/mastodon/components/copy_button';
import { formatWorldPlanServer } from '@/mastodon/utils/world_plan';

import classes from './world_plan_card.module.scss';

const messages = defineMessages({
  label: {
    id: 'account.world_plan.label',
    defaultMessage: 'Project Sekai ID',
  },
  gameId: {
    id: 'account_edit.world_plan.modal.game_id_label',
    defaultMessage: 'Game ID',
  },
  copy: {
    id: 'account.world_plan.copy_id',
    defaultMessage: 'Copy game ID',
  },
});

export const WorldPlanCard = ({
  server,
  gameId,
  embedded = false,
}: {
  server: string;
  gameId: string;
  embedded?: boolean;
}) => {
  const intl = useIntl();

  return (
    <div
      className={classNames(classes.card, embedded && classes.embedded)}
      role='group'
      aria-label={intl.formatMessage(messages.label)}
    >
      <img
        className={classes.logo}
        src={projectSekaiLogo}
        alt=''
        width={1000}
        height={350}
      />
      <div className={classes.details}>
        <div className={classes.header}>
          <span className={classes.server}>
            <b>{server.toUpperCase()}</b>
            {formatWorldPlanServer(intl, server)}
          </span>
          <span className={classes.label} aria-hidden>
            {intl.formatMessage(messages.gameId)}
          </span>
        </div>
        <dl className={classes.identity}>
          <dt className='sr-only'>{intl.formatMessage(messages.gameId)}</dt>
          <dd>
            <span className={classes.gameId}>{gameId}</span>
            <CopyIconButton
              className={classes.copyButton}
              title={intl.formatMessage(messages.copy)}
              value={gameId}
            />
          </dd>
        </dl>
      </div>
    </div>
  );
};
