import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import TranscriptionUI from "../features/Transcription/TranscriptionUI";

const HomePage = () => {
  const [transcript, setTranscript] = useState("");

  return (
    <AppLayout>
      <TranscriptionUI onTranscript={setTranscript} />
    </AppLayout>
  );
};

export default HomePage;
