import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStage } from '../store/slices/interviewSlice';
import JobDetails from '../components/InterviewStages/JobDetails';
import ConfigureQuestions from '../components/InterviewStages/ConfigureQuestions';
import SummaryReview from '../components/InterviewStages/SummaryReview';
import styles from '../styles/InterviewStages.module.scss';
import { isStageOneValid } from '../components/InterviewStages/JobDetails';
import { isStageTwoValid } from '../components/InterviewStages/ConfigureQuestions';

const steps = ['Job Details', 'Configure Questions', 'Summary & Review'];

export default function Home() {
  const dispatch = useDispatch();
  const currentStage = useSelector((state) => state.interview.stage);
  const jobDetails = useSelector((state) => state.interview.jobDetails);
  const questions = useSelector((state) => state.interview.questions);

  const handleNext = () => {
    localStorage.setItem('interviewAppState', JSON.stringify(currentStage));
    
    dispatch(setStage(currentStage + 1));
  };

  const handleBack = () => {
    dispatch(setStage(currentStage - 1));
  };

  const isNextButtonEnabled = () => {
    switch (currentStage) {
      case 1:
        return isStageOneValid(jobDetails);
      case 2:
        return isStageTwoValid(questions);
      default:
        return false;
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <JobDetails />;
      case 2:
        return <ConfigureQuestions />;
      case 3:
        return <SummaryReview />;
      default:
        return <JobDetails />;
    }
  };

  return (
    <Box className={styles.mainContainer}>
      <Stepper activeStep={currentStage - 1}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className={styles.stageContent}>
        {renderStage()}
      </Box>

      {currentStage < 3 && (
        <Box className={styles.navigation}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={currentStage === 1}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isNextButtonEnabled()}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
