import { Box, Typography, Button, TextField, Paper, Slider } from "@mui/material";
import styles from "../../styles/InterviewStages.module.scss";
import { QUESTION_FORM_TEXT } from "../../constants/text";

export default function QuestionForm({
  activeQuestion,
  setActiveQuestion,
  isEditing,
  onSubmit,
  onCancel
}) {
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Box className={styles.questionForm}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label={isEditing ? QUESTION_FORM_TEXT.EDIT_QUESTION : QUESTION_FORM_TEXT.NEW_QUESTION}
          value={activeQuestion.text}
          onChange={(e) => setActiveQuestion({ ...activeQuestion, text: e.target.value })}
          className={styles.questionInput}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#6200ee",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#6200ee",
            },
          }}
        />

        <Box className={styles.weightageSection}>
          <Typography variant="body2" color="textSecondary">
            {QUESTION_FORM_TEXT.WEIGHTAGE_SCORE}
          </Typography>
          <Slider
            value={activeQuestion.weightage}
            onChange={(_, value) => setActiveQuestion({ ...activeQuestion, weightage: value })}
            min={0}
            max={3}
            step={1}
            marks={[{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }]}
            sx={{
              width: "200px",
              ml: 2,
              "& .MuiSlider-thumb": {
                "&.Mui-active, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(98, 0, 238, 0.16)",
                },
                backgroundColor: "#6200ee",
                width: "16px",
                height: "16px",
              },
              "& .MuiSlider-track": {
                backgroundColor: "#6200ee",
              },
              "& .MuiSlider-mark": {
                backgroundColor: "#bfbfbf",
                width: "1px",
                height: "8px",
              },
              "& .MuiSlider-markLabel": {
                fontSize: "0.75rem",
                color: "rgba(0, 0, 0, 0.6)",
                transform: "translateY(8px)",
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: "#6200ee",
              color: "#6200ee",
              "&:hover": {
                borderColor: "#6200ee",
                backgroundColor: "rgba(98, 0, 238, 0.04)",
              },
            }}
          >
            {QUESTION_FORM_TEXT.CANCEL}
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={!activeQuestion.text.trim()}
            sx={{
              backgroundColor: "#6200ee",
              "&:hover": {
                backgroundColor: "#6200ee",
                opacity: 0.9,
              },
              "&:disabled": {
                backgroundColor: "rgba(98, 0, 238, 0.12)",
              },
            }}
          >
            {isEditing ? QUESTION_FORM_TEXT.SAVE_CHANGES : QUESTION_FORM_TEXT.ADD_QUESTION}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
