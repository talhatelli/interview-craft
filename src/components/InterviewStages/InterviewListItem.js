import { ListItem, ListItemText, Typography, Box, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { INTERVIEW_LIST_ITEM_TEXT } from '@/constants/text';

export default function InterviewListItem({ interview, onEdit }) {
  return (
    <Paper
      elevation={0}
      sx={{
        padding: 3,
        marginBottom: 2,
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }}
    >
      <ListItem
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 0
        }}
      >
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 2
              }}
            >
              {interview.jobDetails.title}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 20, color: '#666' }} />
                <Typography variant="body2" color="#666">
                  {interview.jobDetails.duration} {INTERVIEW_LIST_ITEM_TEXT.MINUTES}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ fontSize: 20, color: '#666' }} />
                <Typography variant="body2" color="#666">
                  {interview.jobDetails.workLocation.charAt(0).toUpperCase() +
                    interview.jobDetails.workLocation.slice(1)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 20, color: '#666' }} />
                <Typography variant="body2" color="#666">
                  {INTERVIEW_LIST_ITEM_TEXT.CREATED_ON} {new Date(interview.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          }
        />
        <IconButton
          onClick={() => onEdit(interview)}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#eeeeee',
            }
          }}
        >
          <EditIcon sx={{ color: '#6200ee' }} />
        </IconButton>
      </ListItem>
    </Paper>
  );
}
