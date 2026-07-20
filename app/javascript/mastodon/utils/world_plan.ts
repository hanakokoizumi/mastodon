export const WORLD_PLAN_SERVERS = ['jp', 'tw', 'en', 'kr', 'cn'] as const;

export type WorldPlanServer = (typeof WORLD_PLAN_SERVERS)[number];

export const isWorldPlanConfigured = (
  server: string,
  gameId: string,
): boolean => server.length > 0 && gameId.length > 0;

export const worldPlanServerMessages = {
  jp: {
    id: 'account.world_plan.server.jp',
    defaultMessage: 'Japan',
  },
  tw: {
    id: 'account.world_plan.server.tw',
    defaultMessage: 'Traditional Chinese',
  },
  en: {
    id: 'account.world_plan.server.en',
    defaultMessage: 'Global',
  },
  kr: {
    id: 'account.world_plan.server.kr',
    defaultMessage: 'Korea',
  },
  cn: {
    id: 'account.world_plan.server.cn',
    defaultMessage: 'Mainland China',
  },
} as const;

export const formatWorldPlanServer = (
  intl: {
    formatMessage: (descriptor: {
      id: string;
      defaultMessage: string;
    }) => string;
  },
  server: string,
) => {
  if (!WORLD_PLAN_SERVERS.includes(server as WorldPlanServer)) {
    return server;
  }

  return intl.formatMessage(worldPlanServerMessages[server as WorldPlanServer]);
};
