import { useMemo, useState } from 'react';
import { Alert, Box, Container, Grid, Stack } from '@mui/material';
import AppHeader from './components/AppHeader';
import AudioPlayerCard from './components/AudioPlayerCard';
import EmptyState from './components/EmptyState';
import EvaluationActions from './components/EvaluationActions';
import ModeSelector from './components/ModeSelector';
import RecorderCard from './components/RecorderCard';
import ReviewSummaryCard from './components/ReviewSummaryCard';
import SampleNavigator from './components/SampleNavigator';
import StatusBanner from './components/StatusBanner';
import TranscriptReviewer from './components/TranscriptReviewer';
import useAudioRecorder from './hooks/useAudioRecorder';
import useEvaluationSession from './hooks/useEvaluationSession';
import { MODES } from './constants';
import { downloadJson } from './utils/downloadUtils';
import { transcribeWithKhaya } from './api/KhayaApi';

export default function App() {
  const {
    mode,
    setMode,
    samples,
    currentIndex,
    currentItem,
    results,
    loadingSamples,
    samplesError,
    loadPreRecordedSample,
    setMicrophoneItem,
    toggleWord,
    clearSelections,
    nextSample,
    previousSample,
  } = useEvaluationSession();

  const {
    isRecording,
    audioBlob,
    audioUrl,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [transcribeError, setTranscribeError] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleModeChange = (nextMode) => {
    setSuccessMessage('');
    setTranscribeError('');
    setMode(nextMode);

    if (nextMode === MODES.PRE_RECORDED && samples.length > 0) {
      loadPreRecordedSample(currentIndex);
    }
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    try {
      setTranscribeError('');
      setSuccessMessage('');
      setIsTranscribing(true);

      const { transcript } = await transcribeWithKhaya(audioBlob);

      if (!transcript?.trim()) {
        throw new Error('No transcript was returned from the API.');
      }

      setMicrophoneItem({
        transcript,
        audioUrl,
      });

      setSuccessMessage('Microphone audio transcribed successfully.');
    } catch (error) {
      setTranscribeError(error.message || 'Transcription failed.');
    } finally {
      setIsTranscribing(false);
    }
  };


  const handleExport = () => {
    downloadJson('asr-evaluation-results.json', results);
  };

  const currentTokens = useMemo(() => currentItem?.tokens || [], [currentItem]);

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <AppHeader />

        <Stack spacing={3}>
          <ModeSelector mode={mode} onChange={handleModeChange} />

          {samplesError ? <Alert severity="error">{samplesError}</Alert> : null}
          {recorderError ? <Alert severity="error">{recorderError}</Alert> : null}
          {transcribeError ? <Alert severity="error">{transcribeError}</Alert> : null}
          <StatusBanner severity="success" message={successMessage} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                  {mode === MODES.PRE_RECORDED ? (
                    loadingSamples ? (
                      <EmptyState
                        title="Loading samples"
                        description="Please wait while the pre-recorded evaluation set is being prepared."
                      />
                    ) : currentItem ? (
                      <>
                        <AudioPlayerCard
                          title={currentItem.title}
                          audioUrl={currentItem.audioUrl}
                        />
                        <TranscriptReviewer
                          tokens={currentTokens}
                          onToggleWord={toggleWord}
                        />
                        <SampleNavigator
                          currentIndex={currentIndex}
                          total={samples.length}
                          onPrevious={previousSample}
                          onNext={nextSample}
                        />
                      </>
                    ) : (
                      <EmptyState
                        title="No sample available"
                        description="Add your sample data and audio files to begin."
                      />
                    )
                  ) : (
                  <>
                    <RecorderCard
                      isRecording={isRecording}
                      audioUrl={audioUrl}
                      error={recorderError}
                      isTranscribing={isTranscribing}
                      onStart={startRecording}
                      onStop={stopRecording}
                      onReset={resetRecording}
                      onTranscribe={handleTranscribe}
                    />

                    {currentItem && currentItem.mode === MODES.MICROPHONE ? (
                      <>
                        <AudioPlayerCard
                          title={currentItem.title}
                          audioUrl={currentItem.audioUrl}
                        />
                        <TranscriptReviewer
                          tokens={currentTokens}
                          onToggleWord={toggleWord}
                        />
                      </>
                    ) : (
                      <EmptyState
                        title="No transcript yet"
                        description="Record speech and send it to the Khaya API to start review."
                      />
                    )}
                  </>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <ReviewSummaryCard tokens={currentTokens} />

                <EvaluationActions
                  onClear={clearSelections}
                  onExport={handleExport}
                  disableExport={results.length === 0}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}