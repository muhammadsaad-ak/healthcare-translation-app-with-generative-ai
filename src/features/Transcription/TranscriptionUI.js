import React, { useState } from "react";
import { IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { TranscriptionService } from "./TranscriptionService";
import { translateText } from "../Translation/TranslationService"; // Translation service
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../utils/constants"; // Import constants

const TranscriptionUI = () => {
  const [service] = useState(new TranscriptionService());
  const [isListening, setIsListening] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE); // Default translation language from constants
  const [loading, setLoading] = useState(false);

  // Handle language selection from the dropdown
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  // Start speech recognition and update the original transcript in real-time
  const startListening = () => {
    setIsListening(true);
    service.start(
      (transcript) => {
        setOriginalTranscript(transcript);
      },
      (error) => {
        console.error("Error:", error);
        setIsListening(false);
      }
    );
    if (service.recognition) { // Assuming your service exposes a recognition instance
      service.recognition.onend = () => {
        setIsListening(false); // Stop listening when recognition ends
      };
    }
  };

  // Function to handle the translation and playback simultaneously
  const handleTranslateAndPlay = async () => {
    setLoading(true);
    try {
      // Translate the current original transcript to the selected language
      const translation = await translateText(originalTranscript, selectedLanguage);
      setTranslatedTranscript(translation);
  
      // Create a SpeechSynthesisUtterance instance
      const speech = new SpeechSynthesisUtterance(translation);
  
      // Get the list of available voices
      const voices = window.speechSynthesis.getVoices();
  
      // Log available voices for debugging
      console.log("Available voices:", voices);
      console.log("Selected language:", selectedLanguage);
  
      // Find a matching voice based on the selected language code
      const selectedVoice = voices.find((voice) =>
        voice.lang.startsWith(selectedLanguage) // Match by the language prefix
      );
  
      if (selectedVoice) {
        speech.voice = selectedVoice; // Set the selected voice for speech
      } else {
        console.warn(`Selected language voice (${selectedLanguage}) not available. Using default voice.`);
        speech.voice = voices.find(voice => voice.default); // Use the default voice if no match
      }
  
      // Set the language for speech synthesis
      speech.lang = selectedLanguage;
  
      // Handle errors
      speech.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
      };
  
      // Play the translated text
      window.speechSynthesis.speak(speech);
  
      // Ensure the speech ends properly
      speech.onend = () => {
        console.log("Speech synthesis finished.");
      };
  
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  return (
    <div>
      <Typography variant="h6">Transcription</Typography>
      <IconButton color="primary" onClick={startListening} disabled={isListening}>
        <MicIcon />
      </IconButton>

      <Box mt={3}>
        <Typography variant="h6">Original Transcript:</Typography>
        <Typography variant="body1">{originalTranscript}</Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Select Language for Translation:</Typography>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            label="Language"
            fullWidth
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleTranslateAndPlay}
          disabled={loading || !originalTranscript}
        >
          Play Translation
        </Button>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Translated Transcript:</Typography>
        <Typography variant="body1">{translatedTranscript}</Typography>
      </Box>
    </div>
  );
};

export default TranscriptionUI;
