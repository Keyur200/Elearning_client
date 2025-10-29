import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PreviewVideoDialog = ({
  open,
  handleClose,
  previewVideos,
  currentIndex,
  handlePrev,
  handleNext,
}) => {
  const currentVideo = previewVideos[currentIndex];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{currentVideo?.title}</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* ===== Video Player ===== */}
        {previewVideos.length > 0 && (
          <Box sx={{ position: "relative", textAlign: "center", mb: 3 }}>
            <iframe
              width="100%"
              height="400"
              src={currentVideo?.videoUrl}
              title="Preview Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>

            {previewVideos.length > 1 && (
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIosNewIcon />}
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  Prev
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={handleNext}
                  disabled={currentIndex === previewVideos.length - 1}
                >
                  Next
                </Button>
              </Stack>
            )}
          </Box>
        )}

        {/* ===== Upcoming Videos List ===== */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Upcoming Videos in this Section
        </Typography>

        <List>
          {previewVideos.map((video, i) => (
            <ListItem
              key={video._id}
              selected={i === currentIndex}
              onClick={() => handleNext(i)}
              sx={{
                borderRadius: 1,
                mb: 1,
                cursor: "pointer",
                backgroundColor: i === currentIndex ? "#f0f0f0" : "inherit",
                "&:hover": { backgroundColor: "#f7f7f7" },
              }}
            >
              <ListItemText
                primary={video.title}
                secondary={`Duration: ${video.duration} min`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewVideoDialog;
