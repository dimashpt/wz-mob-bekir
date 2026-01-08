export interface LabelListResponse {
  payload: Label[];
}

export interface Label {
  color: string;
  description: string;
  id: number;
  show_on_sidebar: boolean;
  title: string;
}
