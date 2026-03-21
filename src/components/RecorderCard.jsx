import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';

export default function RecorderCard({
  isRecording,
  audioUrl,
  error,
  isTranscribing,
  onStart,
  onStop,
  onReset,
  onTranscribe,
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Microphone Input
        </Typography>

        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<MicRoundedIcon />}
              onClick={onStart}
              disabled={isRecording || isTranscribing}
            >
              Start Recording
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<StopRoundedIcon />}
              onClick={onStop}
              disabled={!isRecording || isTranscribing}
            >
              Stop Recording
            </Button>

            <Button
              variant="text"
              startIcon={<RestartAltRoundedIcon />}
              onClick={onReset}
              disabled={isRecording || isTranscribing}
            >
              Reset
            </Button>
          </Stack>

          {isRecording ? (
            <Alert severity="info">Recording in progress…</Alert>
          ) : null}

          {audioUrl ? (
            <audio controls style={{ width: '100%' }}>
              <source src={audioUrl} />
              Your browser does not support the audio element.
            </audio>
          ) : null}

          <Button
            variant="contained"
            color="secondary"
            startIcon={isTranscribing ? <CircularProgress size={18} color="inherit" /> : <CloudUploadRoundedIcon />}
            onClick={onTranscribe}
            disabled={!audioUrl || isRecording || isTranscribing}
          >
            {isTranscribing ? 'Transcribing…' : 'Send to Khaya API'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}