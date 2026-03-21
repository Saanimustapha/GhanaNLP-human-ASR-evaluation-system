import { Box, Stack, Typography } from '@mui/material';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';

export default function AppHeader() {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ mb: 3 }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <GraphicEqRoundedIcon />
      </Box>

      <Box>
        <Typography variant="h4">ASR Evaluation Web App</Typography>
        <Typography variant="body1" color="text.secondary">
          Fast word-level review for prerecorded and live microphone transcripts
        </Typography>
      </Box>
    </Stack>
  );
}