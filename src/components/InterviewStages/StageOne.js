import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  TextField, 
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { setJobDetails } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';

const initialDetails = {
  title: '',
  description: '',
  duration: '10',
  workLocation: 'onsite', // 'remote', 'hybrid', 'onsite'
};

const durationOptions = [
  '10', '15', '20', '30', '45', '60'
];

export default function StageOne() {
  const dispatch = useDispatch();
  const jobDetails = useSelector((state) => state.interview.jobDetails) || initialDetails;
  const [localDetails, setLocalDetails] = useState(jobDetails);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!localDetails.title) {
      newErrors.title = 'Job title is required';
    }
    if (!localDetails.description) {
      newErrors.description = 'Job description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (validateForm()) {
      dispatch(setJobDetails(localDetails));
    }
  }, [localDetails, dispatch]);

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h6" gutterBottom>
        Job Description Details
      </Typography>
      
      <Box component="form" className={styles.form}>
        <TextField
          fullWidth
          label="Job Title"
          name="title"
          value={localDetails.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          placeholder="e.g., Frontend Developer"
          className={styles.formField}
        />
        
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Job Description"
          name="description"
          value={localDetails.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          className={styles.formField}
          placeholder="Write a detailed job description..."
        />

        <FormControl fullWidth className={styles.formField}>
          <InputLabel>Interview Duration (AI will generate 6 questions)</InputLabel>
          <Select
            name="duration"
            value={localDetails.duration}
            onChange={handleChange}
            label="Interview Duration (AI will generate 6 questions)"
          >
            {durationOptions.map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration} minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className={styles.locationSection}>
          <Typography variant="subtitle1" gutterBottom>
            Job Location
          </Typography>
          <RadioGroup
            name="workLocation"
            value={localDetails.workLocation}
            onChange={handleChange}
            row
          >
            <FormControlLabel 
              value="remote" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">Remote</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Work from anywhere
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel 
              value="hybrid" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">Hybrid</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Work from home/office
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel 
              value="onsite" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">Onsite</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Work from office
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
} 