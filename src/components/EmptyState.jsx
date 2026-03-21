import { Card, CardContent, Typography } from '@mui/material';

export default function EmptyState({ title, description }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}