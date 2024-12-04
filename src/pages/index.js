import { Box, List, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInterviews, resetForm } from '../store/slices/interviewSlice';
import AddIcon from '@mui/icons-material/Add';
import InterviewListItem from '../components/InterviewStages/InterviewListItem';
import EmptyState from '../components/common/EmptyState';
import { ROUTES } from '../constants/routes';
import { STORAGE_KEYS } from '../constants/storage';
import { HOME_PAGE_TEXT } from '../constants/text';

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const interviews = useSelector((state) => state.interview.allInterviews);

  useEffect(() => {
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  const handleCreateInterview = () => {
    dispatch(resetForm());
    localStorage.removeItem(STORAGE_KEYS.INTERVIEW_APP_STATE);
    router.push(ROUTES.INTERVIEW.CREATE);
  };

  const handleEditInterview = (interview) => {
    router.push(ROUTES.INTERVIEW.EDIT(interview.id));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            {HOME_PAGE_TEXT.TITLE}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateInterview}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#6200ee',
              borderRadius: '8px',
              padding: '10px 24px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#6200ee',
                opacity: 0.9,
              }
            }}
          >
            {HOME_PAGE_TEXT.CREATE_BUTTON}
          </Button>
        </Box>

        {interviews && interviews.length > 0 ? (
          <List sx={{ gap: 2 }}>
            {interviews.map((interview) => (
              <InterviewListItem
                key={interview.id}
                interview={interview}
                onEdit={handleEditInterview}
              />
            ))}
          </List>
        ) : (
          <EmptyState message={HOME_PAGE_TEXT.EMPTY_STATE} />
        )}
      </Box>
    </Container>
  );
}
