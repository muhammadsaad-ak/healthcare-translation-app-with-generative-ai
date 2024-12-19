import React, { useState } from "react";
import { Select, MenuItem, Button, Typography } from "@mui/material";
import { translateText } from "./TranslationService";

const TranslationUI = ({ transcript, onTranslation }) => {
  const [language, setLanguage] = useState("es");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const translation = await translateText(transcript, language);
      onTranslation(translation);
    } catch (error) {
      console.error("Translation Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6">Translation</Typography>
      <Select value={language} onChange={(e) => setLanguage(e.target.value)} fullWidth>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="de">German</MenuItem>
      </Select>
      <Button onClick={handleTranslate} disabled={loading} variant="contained" sx={{ mt: 2 }}>
        Translate
      </Button>
    </div>
  );
};

export default TranslationUI;
