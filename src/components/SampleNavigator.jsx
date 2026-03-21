import { Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

export default function SampleNavigator({
  currentIndex,
  total,
  onPrevious,
  onNext,
}) {
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Pre-recorded Progress
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sample {currentIndex + 1} of {total}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 999, mb: 2 }}
        />

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeRoundedIcon />}
            onClick={onPrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            endIcon={<NavigateNextRoundedIcon />}
            onClick={onNext}
            disabled={currentIndex >= total - 1}
          >
            Next
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}