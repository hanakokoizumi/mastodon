import { useCallback, useId, useState } from 'react';
import type { FC } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { Button } from '@/mastodon/components/button';
import { SelectField, TextInputField } from '@/mastodon/components/form_fields';
import type { BaseConfirmationModalProps } from '@/mastodon/features/ui/components/confirmation_modals';
import { ConfirmationModal } from '@/mastodon/features/ui/components/confirmation_modals';
import { patchProfile } from '@/mastodon/reducers/slices/profile_edit';
import { useAppDispatch, useAppSelector } from '@/mastodon/store';
import {
  WORLD_PLAN_SERVERS,
  worldPlanServerMessages,
} from '@/mastodon/utils/world_plan';

import classes from './styles.module.scss';

const messages = defineMessages({
  addTitle: {
    id: 'account_edit.world_plan.modal.add_title',
    defaultMessage: 'Add Project Sekai ID',
  },
  editTitle: {
    id: 'account_edit.world_plan.modal.edit_title',
    defaultMessage: 'Edit Project Sekai ID',
  },
  save: {
    id: 'account_edit.save',
    defaultMessage: 'Save',
  },
  clear: {
    id: 'account_edit.world_plan.modal.clear',
    defaultMessage: 'Clear',
  },
  serverLabel: {
    id: 'account_edit.world_plan.modal.server_label',
    defaultMessage: 'Server',
  },
  serverPlaceholder: {
    id: 'account_edit.world_plan.modal.server_placeholder',
    defaultMessage: 'Select a server',
  },
  gameIdLabel: {
    id: 'account_edit.world_plan.modal.game_id_label',
    defaultMessage: 'Game ID',
  },
  gameIdPlaceholder: {
    id: 'account_edit.world_plan.modal.game_id_placeholder',
    defaultMessage: 'Numbers only',
  },
});

const serverMessages = worldPlanServerMessages;

export const WorldPlanModal: FC<BaseConfirmationModalProps> = ({ onClose }) => {
  const intl = useIntl();
  const titleId = useId();
  const serverId = useId();
  const gameIdFieldId = useId();

  const { profile, isPending } = useAppSelector((state) => state.profileEdit);

  const [server, setServer] = useState(profile?.worldPlanServer ?? '');
  const [gameId, setGameId] = useState(profile?.worldPlanGameId ?? '');

  const dispatch = useAppDispatch();

  const hasWorldPlan = !!(profile?.worldPlanServer && profile.worldPlanGameId);

  const isValidGameId = gameId === '' || /^\d{1,20}$/.test(gameId);
  const isPaired =
    (server === '' && gameId === '') || (server !== '' && gameId !== '');
  const canSave = isValidGameId && isPaired;

  const handleSave = useCallback(() => {
    if (!isPending && canSave) {
      void dispatch(
        patchProfile({
          world_plan_server: server,
          world_plan_game_id: gameId,
        }),
      ).then(onClose);
    }
  }, [canSave, dispatch, gameId, isPending, onClose, server]);

  const handleClear = useCallback(() => {
    if (!isPending) {
      void dispatch(
        patchProfile({
          world_plan_server: '',
          world_plan_game_id: '',
        }),
      ).then(onClose);
    }
  }, [dispatch, isPending, onClose]);

  const handleServerChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setServer(event.target.value);
    },
    [],
  );

  const handleGameIdChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value === '' || /^\d+$/.test(value)) {
        setGameId(value.slice(0, 20));
      }
    },
    [],
  );

  return (
    <ConfirmationModal
      title={intl.formatMessage(
        hasWorldPlan ? messages.editTitle : messages.addTitle,
      )}
      titleId={titleId}
      confirm={intl.formatMessage(messages.save)}
      onConfirm={handleSave}
      onClose={onClose}
      updating={isPending}
      disabled={!canSave}
      noCloseOnConfirm
      noFocusButton
    >
      <div className={classes.worldPlanFields}>
        <SelectField
          id={serverId}
          label={intl.formatMessage(messages.serverLabel)}
          value={server}
          onChange={handleServerChange}
          aria-labelledby={titleId}
        >
          <option value=''>
            {intl.formatMessage(messages.serverPlaceholder)}
          </option>
          {WORLD_PLAN_SERVERS.map((value) => (
            <option key={value} value={value}>
              {intl.formatMessage(serverMessages[value])}
            </option>
          ))}
        </SelectField>

        <TextInputField
          id={gameIdFieldId}
          label={intl.formatMessage(messages.gameIdLabel)}
          placeholder={intl.formatMessage(messages.gameIdPlaceholder)}
          value={gameId}
          onChange={handleGameIdChange}
          inputMode='numeric'
          pattern='[0-9]*'
          autoComplete='off'
        />

        {hasWorldPlan && (
          <Button onClick={handleClear} disabled={isPending} plain>
            {intl.formatMessage(messages.clear)}
          </Button>
        )}
      </div>
    </ConfirmationModal>
  );
};
