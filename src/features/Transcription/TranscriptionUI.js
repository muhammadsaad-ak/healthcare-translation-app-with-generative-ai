import React, { useState } from "react";
import { IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { TranscriptionService } from "./TranscriptionService";
import { translateText } from "../Translation/TranslationService"; // Translation service

const TranscriptionUI = () => {
  const [service] = useState(new TranscriptionService());
  const [isListening, setIsListening] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fr"); // Default translation language
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
        setIsListening(false); // Stop listening if there is an error
      }
    );

    // Add the onend event listener to reset the state after speech recognition ends
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

      // Immediately start playing the translated text
      const speech = new SpeechSynthesisUtterance(translation);
      speech.lang = selectedLanguage; // Set the language for speech synthesis
      window.speechSynthesis.speak(speech);
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
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="de">German</MenuItem>
            {/* Add more languages as needed */}
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
