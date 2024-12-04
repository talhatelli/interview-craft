import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Slider,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateQuestion } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';
import { SORTABLE_QUESTION_TEXT } from "../../constants/text";

export default function SortableQuestionItem({ question, index, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const dispatch = useDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    dispatch(updateQuestion(editedQuestion));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion(question);
    setIsEditing(false);
  };

  return (
    <Paper ref={setNodeRef} style={style} className={styles.questionCard}>
      <Box className={styles.questionHeader}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" {...attributes} {...listeners}>
            <DragIndicatorIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
          >
            {SORTABLE_QUESTION_TEXT.QUESTION} {index + 1}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {!isEditing && (
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Box>

      <Box className={styles.questionContent}>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editedQuestion.text}
            variant="outlined"
            onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              p: 1.5,
              minHeight: '80px',
              color: 'text.primary'
            }}
          >
            {question.text}
          </Typography>
        )}
      </Box>

      <Box className={styles.questionFooter}>
        <Box className={styles.weightageSection}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            {SORTABLE_QUESTION_TEXT.WEIGHTAGE_SCORE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '250px', ml: 2 }}>
            <Slider
              value={isEditing ? (editedQuestion.weightage ?? 1) : (question.weightage ?? 1)}
              onChange={(_, value) => isEditing && setEditedQuestion({ ...editedQuestion, weightage: value })}
              disabled={!isEditing}
              min={0}
              max={3}
              step={1}
              marks={[
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
              ]}
              sx={{
                flex: 1,
                '& .MuiSlider-track': {
                  backgroundColor: '#6200ee',
                },
                '& .MuiSlider-thumb': {
                  backgroundColor: '#6200ee',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#bfbfbf',
                  width: '1px',
                  height: '8px',
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                  color: 'rgba(0, 0, 0, 0.6)',
                  transform: 'translateY(8px)',
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'space-between' }}>
          {isEditing ? (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  borderColor: '#6200ee',
                  color: '#6200ee',
                  '&:hover': {
                    borderColor: '#6200ee',
                    backgroundColor: 'rgba(98, 0, 238, 0.04)',
                  }
                }}
              >
                {SORTABLE_QUESTION_TEXT.CANCEL}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSave}
                disabled={!editedQuestion.text.trim()}
                sx={{
                  backgroundColor: '#6200ee',
                  '&:hover': {
                    backgroundColor: '#6200ee',
                    opacity: 0.9,
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(98, 0, 238, 0.12)',
                  }
                }}
              >
                {SORTABLE_QUESTION_TEXT.SAVE}
              </Button>
            </>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onDelete(index)}
              sx={{
                ml: 'auto',
                borderColor: '#d32f2f',
                color: '#d32f2f',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                }
              }}
            >
              {SORTABLE_QUESTION_TEXT.REMOVE}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
