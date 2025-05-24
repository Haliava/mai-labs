export type LogEntry = {
  id: number,
  user_id: number,
  feature_flag_id: number,
  action: string,
  timestamp: Date,
}

export enum ACTIONS {
  EDIT_FLAG = 'изменил флаг',
  ADD_FLAG = 'добавил флаг',
  DELETE_FLAG = 'удалил флаг',
}