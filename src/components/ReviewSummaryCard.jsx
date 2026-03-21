import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

export default function ReviewSummaryCard({ tokens = [] }) {
  const selected = tokens.filter((token) => token.selected);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Selected Incorrect Words
        </Typography>

        {selected.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No words selected yet.
          </Typography>
        ) : (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {selected.map((token) => (
              <Chip
                key={token.id}
                label={token.text}
                color="error"
                variant="filled"
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}