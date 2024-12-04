import { Paper, Typography } from '@mui/material';

export default function EmptyState({ message }) {
  return (
    <Paper
      sx={{
        padding: 4,
        textAlign: 'center',
        borderRadius: '12px',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Typography color="#666">
        {message}
      </Typography>
    </Paper>
  );
}
