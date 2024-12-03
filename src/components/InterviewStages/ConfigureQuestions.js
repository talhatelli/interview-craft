import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Slider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addQuestion, removeQuestion, updateQuestion, reorderQuestions } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';

function SortableQuestionItem({ question, index, onDelete, onEdit }) {
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

  return (
    <Paper ref={setNodeRef} style={style} className={styles.questionCard}>
      <Box className={styles.questionHeader}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" {...attributes} {...listeners}>
            <DragIndicatorIcon />
          </IconButton>
          <Typography variant="subtitle1" className={styles.questionNumber}>
            question-{index + 1}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(question)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(index)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box className={styles.questionContent}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={question.text}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>

      <Box className={styles.questionFooter}>
        <Box className={styles.weightageSection}>
          <Typography variant="body2" color="textSecondary">
            Weightage Score:
          </Typography>
          <Slider
            value={question.weightage || 50}
            disabled
            sx={{ width: '200px', ml: 2 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default function ConfigureQuestions() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.interview.questions) || [];
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    weightage: 50,
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      dispatch(reorderQuestions({ oldIndex, newIndex }));
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.text.trim()) {
      dispatch(addQuestion({
        id: Date.now().toString(),
        ...newQuestion
      }));
      setNewQuestion({ text: '', weightage: 50 });
    }
  };

  const handleDelete = (index) => {
    dispatch(removeQuestion(index));
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingQuestion) {
      dispatch(updateQuestion(editingQuestion));
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
    }
  };

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h5" gutterBottom>
        Configure Questions
      </Typography>

      <Box className={styles.questionForm}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="New Question"
          value={newQuestion.text}
          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
          className={styles.questionInput}
        />

        <Box className={styles.weightageSection}>
          <Typography variant="body2" color="textSecondary">
            Weightage Score:
          </Typography>
          <Slider
            value={newQuestion.weightage}
            onChange={(_, value) => setNewQuestion({ ...newQuestion, weightage: value })}
            sx={{ width: '200px', ml: 2 }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleAddQuestion}
          disabled={!newQuestion.text.trim()}
          className={styles.addButton}
        >
          Add Question
        </Button>
      </Box>

      <Box className={styles.questionsList}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question, index) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>

      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className={styles.dialogPaper}
      >
        <DialogTitle>
          <Typography variant="h6">
            Edit Question
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Question"
            value={editingQuestion?.text || ''}
            onChange={(e) => setEditingQuestion({
              ...editingQuestion,
              text: e.target.value
            })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }
            }}
          />
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography 
              variant="subtitle1" 
              color="textSecondary"
              sx={{ mb: 2 }}
            >
              Weightage Score:
            </Typography>
            <Slider
              value={editingQuestion?.weightage || 50}
              onChange={(_, value) => setEditingQuestion({
                ...editingQuestion,
                weightage: value
              })}
              sx={{ 
                width: '100%',
                '& .MuiSlider-thumb': {
                  width: 15,
                  height: 15
                },
                '& .MuiSlider-track': {
                  height: 5
                },
                '& .MuiSlider-rail': {
                  height: 5
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setIsEditDialogOpen(false)}
            size="large"
            sx={{ 
              minWidth: '120px',
              fontSize: '1rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained"
            size="large"
            sx={{ 
              minWidth: '120px',
              fontSize: '1rem'
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export const isStageTwoValid = (questions) => {
  return questions.length > 0;
};