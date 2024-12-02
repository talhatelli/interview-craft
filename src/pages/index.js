import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setStage } from '../store/slices/interviewSlice';
import StageOne from '../components/InterviewStages/StageOne';
import StageTwo from '../components/InterviewStages/StageTwo';
import StageThree from '../components/InterviewStages/StageThree';
import styles from '../styles/InterviewStages.module.scss';

const steps = ['Job Details', 'Configure Questions', 'Summary & Review'];

export default function Home() {
  const dispatch = useDispatch();
  const currentStage = useSelector((state) => state.interview.stage);

  const handleNext = () => {
    dispatch(setStage(currentStage + 1));
  };

  const handleBack = () => {
    dispatch(setStage(currentStage - 1));
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <StageOne />;
      case 2:
        return <StageTwo />;
      case 3:
        return <StageThree />;
      default:
        return <StageOne />;
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
            disabled={currentStage === 3}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
