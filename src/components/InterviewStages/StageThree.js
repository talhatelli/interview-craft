import { Box, Typography, Paper, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStage, publishInterview } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';

export default function StageThree() {
  const dispatch = useDispatch();
  const { jobDetails, questions, isLoading } = useSelector((state) => state.interview);

  const handleEditSection = (stage) => {
    dispatch(setStage(stage));
  };

  const handlePublish = async () => {
    await dispatch(publishInterview());
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
            <strong>Location:</strong> {jobDetails.workLocation}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            {jobDetails.description}
          </Typography>
        </Box>
      </Paper>

      <Paper className={styles.summarySection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h6">Interview Questions</Typography>
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
              <Typography variant="body1">
                <strong>{index + 1}.</strong> {question.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Box className={styles.navigationButtons}>
        <Button
          variant="outlined"
          onClick={() => handleEditSection(2)}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublish}
          disabled={isLoading}
          className={styles.publishButton}
        >
          Publish Interview
        </Button>
      </Box>
    </Box>
  );
} 