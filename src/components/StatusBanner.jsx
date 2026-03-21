import { Alert } from '@mui/material';

export default function StatusBanner({ severity = 'info', message }) {
  if (!message) return null;
  return <Alert severity={severity}>{message}</Alert>;
}