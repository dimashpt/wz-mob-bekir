export type ConversationTeamsResponse = Team[];

export interface Team {
  account_id: number;
  allow_auto_assign: boolean;
  description: string;
  id: number;
  is_member: boolean;
  name: string;
}
