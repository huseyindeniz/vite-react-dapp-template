export interface IncompleteStatus {
  type: 'incomplete';
  reason: 'error';
  error: string;
}
