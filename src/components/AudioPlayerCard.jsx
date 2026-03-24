import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function AudioPlayerCard({ title, audioUrl }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title || 'Audio Player'}
        </Typography>

        <Stack spacing={2}>
          {audioUrl ? (
            <audio
              key={audioUrl}
              controls
              preload="metadata"
              style={{ width: '100%' }}
            >
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No audio available.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}