import React from "react";
import { Button, Typography } from "@mui/material";
import { PlaybackService } from "./PlaybackService";

const PlaybackUI = ({ translation }) => {
  const service = new PlaybackService();

  return (
    <div>
      <Typography variant="h6">Audio Playback</Typography>
      <Button variant="contained" onClick={() => service.playText(translation)} sx={{ mt: 2 }}>
        Play Translation
      </Button>
    </div>
  );
};

export default PlaybackUI;
