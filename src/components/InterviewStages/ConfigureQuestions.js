import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, TextField, Paper, Slider } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { addQuestion, removeQuestion, updateQuestion, reorderQuestions } from "../../store/slices/interviewSlice";
import styles from "../../styles/InterviewStages.module.scss";
import SortableQuestionItem from "./SortableQuestionItem";
import QuestionForm from "./QuestionForm";
import { CONFIGURE_QUESTIONS_TEXT, BUTTON_TEXT } from "../../constants/text";

export default function ConfigureQuestions() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.interview.questions) || [];
  const [activeQuestion, setActiveQuestion] = useState({
    text: "",
    weightage: 2,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

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
    if (activeQuestion.text.trim()) {
      dispatch(
        addQuestion({
          id: Date.now().toString(),
          text: activeQuestion.text,
          weightage: activeQuestion.weightage ?? 2,
        })
      );
      resetForm();
    }
  };

  const handleDelete = (index) => {
    dispatch(removeQuestion(index));
  };

  const handleEdit = (question) => {
    setActiveQuestion(question);
    setIsEditing(true);
    setShowQuestionForm(true);
  };

  const handleEditSave = () => {
    if (activeQuestion) {
      dispatch(updateQuestion(activeQuestion));
      resetForm();
    }
  };

  const resetForm = () => {
    setActiveQuestion({
      text: "",
      weightage: 2,
    });
    setShowQuestionForm(false);
    setIsEditing(false);
  };

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h5" gutterBottom>
        {CONFIGURE_QUESTIONS_TEXT.TITLE}
      </Typography>

      <Box className={styles.questionsList}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
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

      {!showQuestionForm && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setShowQuestionForm(true)}
          sx={{
            mt: 2,
            width: "100%",
            justifyContent: "center",
            borderColor: "#6200ee",
            color: "#6200ee",
            "&:hover": {
              borderColor: "#6200ee",
              backgroundColor: "rgba(98, 0, 238, 0.04)",
            },
          }}
        >
          {BUTTON_TEXT.ADD_NEW_QUESTION}
        </Button>
      )}

      {showQuestionForm && (
        <QuestionForm
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
          isEditing={isEditing}
          onSubmit={isEditing ? handleEditSave : handleAddQuestion}
          onCancel={resetForm}
        />
      )}
    </Box>
  );
}

export const isStageTwoValid = (questions) => {
  return questions.length > 0;
};
