import { Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { nextStage, prevStage } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';

export default function StageNavigation() {
  const dispatch = useDispatch();
  const { currentStage } = useSelector((state) => state.interview);

  return (
    <Box className={styles.navigation}>
      {currentStage > 1 && (
        <Button 
          variant="contained" 
          onClick={() => dispatch(prevStage())}
        >
          Geri
        </Button>
      )}
      {currentStage < 3 && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => dispatch(nextStage())}
        >
          İleri
        </Button>
      )}
      {currentStage === 3 && (
        <Button 
          variant="contained" 
          color="success"
        >
          Tamamla
        </Button>
      )}
    </Box>
  );
} 