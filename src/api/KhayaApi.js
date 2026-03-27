export async function transcribeWithKhaya(audioBlob, language = 'tw') {
  const apiBaseUrl = import.meta.env.VITE_KHAYA_API_BASE_URL;
  const apiKey = import.meta.env.VITE_KHAYA_API_KEY;

  if (!apiBaseUrl || !apiKey) {
    throw new Error('Khaya API environment variables are missing.');
  }

  const response = await fetch(
    `${apiBaseUrl}/asr/v1/transcribe?language=${encodeURIComponent(language)}`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': audioBlob.type || 'audio/webm',
      },
      body: audioBlob,
    }
  );

  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`API did not return valid JSON. Response: ${rawText}`);
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === 'object' && data !== null && (data.message || data.error)) ||
      rawText ||
      'Khaya API transcription failed.'
    );
  }

  let transcript = '';

  if (typeof data === 'string') {
    transcript = data;
  } else if (typeof data === 'object' && data !== null) {
    transcript =
      data.transcript ||
      data.text ||
      data.result ||
      data.prediction ||
      data.data?.transcript ||
      data.data?.text ||
      data.output ||
      '';
  }

  if (!transcript || !String(transcript).trim()) {
    throw new Error(`No transcript was returned from the API. Raw response: ${rawText}`);
  }

  return {
    transcript: String(transcript).trim(),
    raw: data,
  };
}