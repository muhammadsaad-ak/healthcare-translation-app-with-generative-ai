export class TranscriptionService {
    constructor() {
      if (!window.webkitSpeechRecognition) {
        throw new Error("Web Speech API is not supported in this browser.");
      }
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.lang = "en-US";
    }
  
    start(onResult, onError) {
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      this.recognition.onerror = (event) => {
        onError(event.error);
      };
      this.recognition.start();
    }
  }
  