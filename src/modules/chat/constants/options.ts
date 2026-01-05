import { Option } from '@/components';
import { i18n } from '@/lib/i18n';
import { ConversationStatus } from '../services/conversation/types';

const t = i18n.t;

export function getStatusFilterOptions(): Option[] {
  return [
    { label: t('chat.filters.all'), value: 'all' },
    { label: t('chat.status.open'), value: 'open' },
    { label: t('chat.status.pending'), value: 'pending' },
    { label: t('chat.status.snooze'), value: 'snoozed' },
    { label: t('chat.status.resolve'), value: 'resolved' },
  ];
}

export function getAssigneeFilterOptions(): Option[] {
  return [
    { label: t('chat.filters.all'), value: 'all' },
    { label: t('chat.filters.me'), value: 'me' },
    { label: t('chat.filters.unassigned'), value: 'unassigned' },
  ];
}

export function getSortFilterOptions(): Option[] {
  return [
    { label: t('chat.filters.latest'), value: 'latest' },
    {
      label: t('chat.filters.sort_on_created_at'),
      value: 'sort_on_created_at',
    },
    { label: t('chat.filters.sort_on_priority'), value: 'sort_on_priority' },
  ];
}

export function getBulkStatusOptions(): Option<ConversationStatus>[] {
  return [
    { label: t('chat.status.open'), value: 'open' },
    { label: t('chat.status.pending'), value: 'pending' },
    { label: t('chat.status.snooze'), value: 'snoozed' },
    { label: t('chat.status.resolve'), value: 'resolved' },
  ];
}
