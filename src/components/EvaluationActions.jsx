import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function EvaluationActions({
  onClear,
  onSave,
  onExport,
  disableExport,
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Actions
        </Typography>

        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={onClear}
          >
            Clear Selection
          </Button>

          <Button
            variant="text"
            startIcon={<DownloadRoundedIcon />}
            onClick={onExport}
            disabled={disableExport}
          >
            Export Results JSON
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}