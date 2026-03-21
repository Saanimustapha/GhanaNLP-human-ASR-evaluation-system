import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

export default function TranscriptReviewer({ tokens = [], onToggleWord }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transcript Review
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click any word that is mistranscribed. Click again to unselect it.
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ alignItems: 'flex-start' }}
        >
          {tokens.map((token) => (
            <Chip
              key={token.id}
              label={token.text}
              clickable
              color={token.selected ? 'error' : 'default'}
              variant={token.selected ? 'filled' : 'outlined'}
              onClick={() => onToggleWord(token.id)}
              sx={{
                fontSize: '0.98rem',
                py: 2.4,
                px: 0.4,
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}