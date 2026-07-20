import type { FC } from 'react';

import { defineMessage, useIntl } from 'react-intl';

import { MiniCard } from '@/mastodon/components/mini_card';
import { useAccount } from '@/mastodon/hooks/useAccount';
import {
  formatWorldPlanServer,
  isWorldPlanConfigured,
} from '@/mastodon/utils/world_plan';

import classes from './styles.module.scss';

const labelMessage = defineMessage({
  id: 'account.world_plan.label',
  defaultMessage: 'Project Sekai ID',
});

const valueMessage = defineMessage({
  id: 'account.world_plan.value',
  defaultMessage: '{server} · {gameId}',
});

export const AccountHeaderWorldPlan: FC<{ accountId: string }> = ({
  accountId,
}) => {
  const intl = useIntl();
  const account = useAccount(accountId);

  if (
    !account ||
    !isWorldPlanConfigured(
      account.world_plan_server,
      account.world_plan_game_id,
    )
  ) {
    return null;
  }

  const serverLabel = formatWorldPlanServer(intl, account.world_plan_server);

  return (
    <dl className={classes.fieldList}>
      <MiniCard
        className={classes.fieldItem}
        label={
          <span className='translate'>{intl.formatMessage(labelMessage)}</span>
        }
        value={
          <span className='translate'>
            {intl.formatMessage(valueMessage, {
              server: serverLabel,
              gameId: account.world_plan_game_id,
            })}
          </span>
        }
      />
    </dl>
  );
};
