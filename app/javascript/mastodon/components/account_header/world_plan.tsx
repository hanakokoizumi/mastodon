import type { FC } from 'react';

import { useAccount } from '@/mastodon/hooks/useAccount';
import { WorldPlanCard } from '@/mastodon/nightcord/components/world_plan_card';
import { isWorldPlanConfigured } from '@/mastodon/utils/world_plan';

export const AccountHeaderWorldPlan: FC<{ accountId: string }> = ({
  accountId,
}) => {
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

  return (
    <WorldPlanCard
      server={account.world_plan_server}
      gameId={account.world_plan_game_id}
    />
  );
};
