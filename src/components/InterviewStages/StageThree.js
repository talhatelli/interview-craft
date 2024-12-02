import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStage, publishInterview } from '../../store/slices/interviewSlice';
import MarkdownIt from 'markdown-it';
import styles from '../../styles/InterviewStages.module.scss';

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
            <strong>Location:</strong> {jobDetails.workLocation.charAt(0).toUpperCase() + jobDetails.workLocation.slice(1)}
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