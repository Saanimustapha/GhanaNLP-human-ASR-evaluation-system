import { Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { MODES } from '../constants';

export default function ModeSelector({ mode, onChange }) {
  const handleChange = (_, nextMode) => {
    if (nextMode) onChange(nextMode);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Evaluation Mode
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleChange}
          fullWidth
        >
          <ToggleButton value={MODES.PRE_RECORDED}>
            Pre-recorded Audio
          </ToggleButton>
          <ToggleButton value={MODES.MICROPHONE}>
            Microphone Input
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}