import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
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
  const [preRecordedItem, setPreRecordedItem] = useState(null); 
  const [microphoneItem, setMicrophoneCurrentItem] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [samplesError, setSamplesError] = useState('');

  const currentItem = mode === MODES.PRE_RECORDED ? preRecordedItem : microphoneItem;
  const audioBaseURL = import.meta.env.VITE_AUDIO_BASE_URL;

  useEffect(() => {
    async function loadSamples() {
      try {
        setLoadingSamples(true);
        setSamplesError('');

        const response = await fetch('/data/metadata.csv');
        if (!response.ok) {
          throw new Error('Failed to load metadata CSV.');
        }

        const csvText = await response.text();

        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
          throw new Error(parsed.errors[0].message || 'Failed to parse CSV.');
        }

        const formattedSamples = parsed.data.map((row, index) => ({
          id: row.file ? String(row.file).trim().replace('.wav', '') : `sample-${index + 1}`,
          title: row.file ? String(row.file).trim() : `Sample ${index + 1}`,
          audioUrl: `${audioBaseURL}/${String(row.file).trim()}`,
          transcript: row.text || '',
        }));

        setSamples(formattedSamples);

        if (formattedSamples.length > 0) {
          setPreRecordedItem({
            ...formattedSamples[0],
            mode: MODES.PRE_RECORDED,
            tokens: tokenizeTranscript(formattedSamples[0].transcript),
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

  const buildTokensWithSavedSelections = (sample, existingResult) => {
    let tokens = tokenizeTranscript(sample.transcript);

    if (existingResult?.incorrectTokenIds?.length) {
      tokens = tokens.map((token) => ({
        ...token,
        selected: existingResult.incorrectTokenIds.includes(token.id),
      }));
    }

    return tokens;
  };

  const loadPreRecordedSample = (index) => {
    if (!samples[index]) return;

    const sample = samples[index];
    const existingResult = results.find((item) => item.id === sample.id);

    setCurrentIndex(index);
      setPreRecordedItem({
        ...sample,
        mode: MODES.PRE_RECORDED,
        tokens: buildTokensWithSavedSelections(sample, existingResult),
      });
  };

  const setMicrophoneItem = ({ transcript, audioUrl }) => {
    const id = `mic-${Date.now()}`;
    const existingResult = results.find((item) => item.id === id);

  setMicrophoneCurrentItem({
    id,
    title: 'Live Microphone Transcript',
    audioUrl,
    transcript,
    mode: MODES.MICROPHONE,
    tokens: buildTokensWithSavedSelections(
      {
        id,
        transcript,
      },
      existingResult
    ),
  });
  };

  const persistCurrentItem = (updatedItem) => {
    const selectedTokens = getSelectedTokens(updatedItem.tokens);

    const entry = {
      id: updatedItem.id,
      title: updatedItem.title,
      mode: updatedItem.mode,
      transcript: updatedItem.transcript,
      incorrectWords: selectedTokens.map((token) => token.text),
      incorrectTokenIds: selectedTokens.map((token) => token.id),
      reviewedAt: new Date().toISOString(),
    };

    setResults((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== entry.id);
      return [...withoutCurrent, entry];
    });
  };

const toggleWord = (tokenId) => {
  if (mode === MODES.PRE_RECORDED) {
    setPreRecordedItem((prev) => {
      if (!prev) return prev;

      const updatedItem = {
        ...prev,
        tokens: toggleTokenSelection(prev.tokens, tokenId),
      };

      persistCurrentItem(updatedItem);
      return updatedItem;
    });
    return;
  }

  setMicrophoneCurrentItem((prev) => {
    if (!prev) return prev;

    const updatedItem = {
      ...prev,
      tokens: toggleTokenSelection(prev.tokens, tokenId),
    };

    persistCurrentItem(updatedItem);
    return updatedItem;
  });
};

const clearSelections = () => {
  if (mode === MODES.PRE_RECORDED) {
    setPreRecordedItem((prev) => {
      if (!prev) return prev;

      const updatedItem = {
        ...prev,
        tokens: clearTokenSelections(prev.tokens),
      };

      persistCurrentItem(updatedItem);
      return updatedItem;
    });
    return;
  }

  setMicrophoneCurrentItem((prev) => {
    if (!prev) return prev;

    const updatedItem = {
      ...prev,
      tokens: clearTokenSelections(prev.tokens),
    };

    persistCurrentItem(updatedItem);
    return updatedItem;
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
    !preRecordedItem
  ) {
    loadPreRecordedSample(currentIndex);
  }
}, [mode, samples, preRecordedItem, currentIndex]);

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
  preRecordedItem,
  microphoneItem,
  results,
  loadingSamples,
  samplesError,
  selectedCount,
  loadPreRecordedSample,
  setMicrophoneItem,
  toggleWord,
  clearSelections,
  nextSample,
  previousSample,
};
}