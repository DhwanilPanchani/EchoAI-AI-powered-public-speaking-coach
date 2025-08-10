import axios from 'axios';

const ASSEMBLY_AI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLY_AI_ENDPOINT = 'https://api.assemblyai.com/v2';

export async function transcribeAudio(audioData: ArrayBuffer): Promise<string | null> {
  try {
    // Upload audio to AssemblyAI
    const uploadResponse = await axios.post(
      `${ASSEMBLY_AI_ENDPOINT}/upload`,
      audioData,
      {
        headers: {
          'authorization': ASSEMBLY_AI_API_KEY,
          'content-type': 'application/octet-stream'
        }
      }
    );

    // Start transcription
    const transcriptResponse = await axios.post(
      `${ASSEMBLY_AI_ENDPOINT}/transcript`,
      {
        audio_url: uploadResponse.data.upload_url,
        language_detection: true
      },
      {
        headers: {
          'authorization': ASSEMBLY_AI_API_KEY,
          'content-type': 'application/json'
        }
      }
    );

    // Poll for completion
    const transcriptId = transcriptResponse.data.id;
    let transcript = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const pollingResponse = await axios.get(
        `${ASSEMBLY_AI_ENDPOINT}/transcript/${transcriptId}`,
        {
          headers: {
            'authorization': ASSEMBLY_AI_API_KEY
          }
        }
      );

      if (pollingResponse.data.status === 'completed') {
        transcript = pollingResponse.data.text;
        break;
      } else if (pollingResponse.data.status === 'error') {
        throw new Error('Transcription failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    return transcript;
  } catch (error) {
    console.error('Transcription error:', error);
    return null;
  }
}

// For real-time transcription, you might want to use AssemblyAI's real-time API
export class RealTimeTranscriber {
  private ws: WebSocket | null = null;

  async connect() {
    // Implementation for AssemblyAI real-time WebSocket
    // This requires upgrading to their real-time plan
  }

  async sendAudio(audioChunk: ArrayBuffer) {
    // Send audio chunks to AssemblyAI
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}