export async function transcribeWithKhaya(audioBlob, language = 'tw') {
  const apiBaseUrl = import.meta.env.VITE_KHAYA_API_BASE_URL;
  const apiKey = import.meta.env.VITE_KHAYA_API_KEY;

  if (!apiBaseUrl || !apiKey) {
    throw new Error('Khaya API environment variables are missing.');
  }

  const supportedLanguages = ['tw', 'gaa', 'dag', 'yo', 'ee', 'ki', 'ha'];
  if (!supportedLanguages.includes(language)) {
    throw new Error(`Unsupported language code: ${language}`);
  }

  const requestUrl = `${apiBaseUrl}/asr/v1/transcribe?language=${encodeURIComponent(language)}`;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/mpeg',
      'Ocp-Apim-Subscription-Key': apiKey,
    },
    body: audioBlob,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Khaya API transcription failed.');
  }

  const data = await response.json();

  return {
    transcript:
      data.transcript ||
      data.text ||
      data.result ||
      data.prediction ||
      '',
    raw: data,
  };
}