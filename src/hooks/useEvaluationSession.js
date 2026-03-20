import { useEffect, useMemo, useState } from 'react';
import { MODES } from '../constants';
import {
  clearTokenSelections,
  getSelectedTokens,
  tokenizeTranscript,
  toggleTokenSelection,
} from '../utils/tokenUtils';

export default function useEvaluationSession() {
  const [mode, setMode] = useState(MODES.PRE_RECORDED);
  const [samples, setSamples] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [samplesError, setSamplesError] = useState('');

  useEffect(() => {
    async function loadSamples() {
      try {
        setLoadingSamples(true);
        setSamplesError('');

        const response = await fetch('/data/samples.json');
        if (!response.ok) {
          throw new Error('Failed to load sample data.');
        }

        const data = await response.json();
        setSamples(data);

        if (data.length > 0) {
          setCurrentItem({
            ...data[0],
            mode: MODES.PRE_RECORDED,
            tokens: tokenizeTranscript(data[0].transcript),
          });
        }
      } catch (error) {
        setSamplesError(error.message || 'Unable to load samples.');
      } finally {
        setLoadingSamples(false);
      }
    }

    loadSamples();
  }, []);

  const loadPreRecordedSample = (index) => {
    if (!samples[index]) return;

    const sample = samples[index];
    setCurrentIndex(index);
    setCurrentItem({
      ...sample,
      mode: MODES.PRE_RECORDED,
      tokens: tokenizeTranscript(sample.transcript),
    });
  };

  const setMicrophoneItem = ({ transcript, audioUrl }) => {
    setCurrentItem({
      id: `mic-${Date.now()}`,
      title: 'Live Microphone Transcript',
      audioUrl,
      transcript,
      mode: MODES.MICROPHONE,
      tokens: tokenizeTranscript(transcript),
    });
  };

  const toggleWord = (tokenId) => {
    setCurrentItem((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tokens: toggleTokenSelection(prev.tokens, tokenId),
      };
    });
  };

  const clearSelections = () => {
    setCurrentItem((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tokens: clearTokenSelections(prev.tokens),
      };
    });
  };

  const saveCurrentResult = () => {
    if (!currentItem) return;

    const selectedTokens = getSelectedTokens(currentItem.tokens);

    const entry = {
      id: currentItem.id,
      title: currentItem.title,
      mode: currentItem.mode,
      transcript: currentItem.transcript,
      incorrectWords: selectedTokens.map((token) => token.text),
      incorrectTokenIds: selectedTokens.map((token) => token.id),
      reviewedAt: new Date().toISOString(),
    };

    setResults((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== entry.id);
      return [...withoutCurrent, entry];
    });
  };

  const nextSample = () => {
    if (mode !== MODES.PRE_RECORDED) return;
    if (currentIndex < samples.length - 1) {
      loadPreRecordedSample(currentIndex + 1);
    }
  };

  const previousSample = () => {
    if (mode !== MODES.PRE_RECORDED) return;
    if (currentIndex > 0) {
      loadPreRecordedSample(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (
      mode === MODES.PRE_RECORDED &&
      samples.length > 0 &&
      (!currentItem || currentItem.mode !== MODES.PRE_RECORDED)
    ) {
      loadPreRecordedSample(currentIndex);
    }
  }, [mode, samples]);

  const selectedCount = useMemo(() => {
    if (!currentItem?.tokens) return 0;
    return getSelectedTokens(currentItem.tokens).length;
  }, [currentItem]);

  return {
    mode,
    setMode,
    samples,
    currentIndex,
    currentItem,
    results,
    loadingSamples,
    samplesError,
    selectedCount,
    loadPreRecordedSample,
    setMicrophoneItem,
    toggleWord,
    clearSelections,
    saveCurrentResult,
    nextSample,
    previousSample,
  };
}