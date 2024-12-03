import { Box, Typography, Paper, Button, Snackbar, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStage, publishInterview, resetForm, clearPublishSuccess } from '../../store/slices/interviewSlice';
import MarkdownIt from 'markdown-it';
import styles from '../../styles/InterviewStages.module.scss';
import { useState } from 'react';

const mdParser = new MarkdownIt();

const getDifficultyColor = (weightage) => {
  if (weightage <= 33) return '#4caf50'; 
  if (weightage <= 66) return '#ff9800'; 
  return '#f44336';
};

const getDifficultyLabel = (weightage) => {
  if (weightage <= 33) return 'Easy';
  if (weightage <= 66) return 'Medium';
  return 'Hard';
};

export default function SummaryReview() {
  const dispatch = useDispatch();
  const { 
    jobDetails, 
    questions, 
    isLoading, 
    publishSuccess 
  } = useSelector((state) => state.interview);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const handleEditSection = (stage) => {
    dispatch(setStage(stage));
  };

  const handlePublishClick = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    setIsPublishDialogOpen(false);
    try {
      await dispatch(publishInterview()).unwrap();
      setTimeout(() => {
        dispatch(resetForm());
      }, 2000);
    } catch (error) {
      console.error('Failed to publish interview:', error);
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(clearPublishSuccess());
  };

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h4" gutterBottom>
        Summary & Review
      </Typography>

      <Paper className={styles.summarySection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h6">Job Details</Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleEditSection(1)}
            className={styles.editButton}
          >
            Edit
          </Button>
        </Box>
        
        <Box className={styles.sectionContent}>
          <Typography variant="body1" gutterBottom>
            <strong>Title:</strong> {jobDetails.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Duration:</strong> {jobDetails.duration} minutes
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Location:</strong> 
            <Chip 
              label={jobDetails.workLocation} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong>
          </Typography>
          <Box 
            className={styles.markdownPreview}
            dangerouslySetInnerHTML={{ 
              __html: mdParser.render(jobDetails.description || '') 
            }} 
          />
        </Box>
      </Paper>

      <Paper className={styles.summarySection} sx={{ mt: 3 }}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h6">Questions ({questions.length})</Typography>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleEditSection(2)}
            className={styles.editButton}
          >
            Edit
          </Button>
        </Box>
        
        <Box className={styles.sectionContent}>
          {questions.map((question, index) => (
            <Box key={question.id} className={styles.questionItem}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" sx={{ flex: 1 }}>
                  <strong>{index + 1}.</strong> {question.text}
                </Typography>
                <Chip
                  label={`${getDifficultyLabel(question.weightage)} (${question.weightage}%)`}
                  size="small"
                  sx={{
                    backgroundColor: getDifficultyColor(question.weightage),
                    color: 'white',
                    fontWeight: 'bold',
                    ml: 2,
                    width: '120px'
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box className={styles.navigationButtons}>
        <Button
          variant="outlined"
          onClick={() => handleEditSection(2)}
          className={styles.backButton}
          disabled={isLoading}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handlePublishClick}
          disabled={isLoading}
          className={styles.publishButton}
        >
          {isLoading ? 'Publishing...' : 'Publish Interview'}
        </Button>
      </Box>

      <Dialog 
        open={isPublishDialogOpen} 
        onClose={() => setIsPublishDialogOpen(false)}
      >
        <DialogTitle>Confirm Publication</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to publish this interview? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsPublishDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublishConfirm}
            variant="contained"
            color="primary"
            autoFocus
          >
            Yes, Publish
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={publishSuccess} 
        autoHideDuration={2000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Interview published successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 