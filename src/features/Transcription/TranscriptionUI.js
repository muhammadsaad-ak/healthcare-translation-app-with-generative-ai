import React, { useState } from "react";
import { IconButton, Typography, Box, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { TranscriptionService } from "./TranscriptionService";
import { translateText } from "../Translation/TranslationService"; 
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../utils/constants"; 

const TranscriptionUI = () => {
  const [service] = useState(new TranscriptionService());
  const [isListening, setIsListening] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE); 
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

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
    if (service.recognition) { 
      service.recognition.onend = () => {
        setIsListening(false); 
      };
    }
  };

  const handleTranslateAndPlay = async () => {
    setLoading(true);
    try {
      const translation = await translateText(originalTranscript, selectedLanguage);
      setTranslatedTranscript(translation);
  
      const speech = new SpeechSynthesisUtterance(translation);
  
      const voices = window.speechSynthesis.getVoices();
  
      console.log("Available voices:", voices);
      console.log("Selected language:", selectedLanguage);
  
      const selectedVoice = voices.find((voice) =>
        voice.lang.startsWith(selectedLanguage) 
      );
  
      if (selectedVoice) {
        speech.voice = selectedVoice; 
      } else {
        console.warn(`Selected language voice (${selectedLanguage}) not available. Using default voice.`);
        speech.voice = voices.find(voice => voice.default); 
      }
  
      speech.lang = selectedLanguage;
  
      speech.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
      };
  
      window.speechSynthesis.speak(speech);
  
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
