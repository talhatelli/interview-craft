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
} from '@mui/material';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { setJobDetails } from '../../store/slices/interviewSlice';
import styles from '../../styles/InterviewStages.module.scss';

const mdParser = new MarkdownIt();

const initialDetails = {
  title: '',
  description: '',
  duration: '10',
  workLocation: 'onsite',
};

const durationOptions = ['10', '15', '20', '30', '45', '60'];

export default function StageOne() {
  const dispatch = useDispatch();
  const jobDetails = useSelector((state) => state.interview.jobDetails) || initialDetails;
  const [localDetails, setLocalDetails] = useState(jobDetails);
  const [errors, setErrors] = useState({});

  const handleEditorChange = ({ text }) => {
    setLocalDetails(prev => ({
      ...prev,
      description: text
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const isFormValid = () => {
    return (
      localDetails.title.trim() !== '' && 
      localDetails.description.trim() !== '' && 
      localDetails.duration !== '' && 
      localDetails.workLocation !== ''
    );
  };

  useEffect(() => {
    if (validateForm()) {
      dispatch(setJobDetails(localDetails));
    }
  }, [localDetails, dispatch]);

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h5" gutterBottom>
        Job Details
      </Typography>
      
      <Box className={styles.form}>
        <TextField
          fullWidth
          label="Job Title"
          name="title"
          value={localDetails.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          className={styles.formField}
        />

        <Box className={styles.editorContainer}>
          <MdEditor
            style={{ height: '300px' }}
            renderHTML={text => mdParser.render(text)}
            onChange={handleEditorChange}
            value={localDetails.description}
            className={errors.description ? styles.editorError : ''}
          />
          {errors.description && (
            <Typography className={styles.error}>
              {errors.description}
            </Typography>
          )}
        </Box>

        <FormControl fullWidth>
          <Select
            name="duration"
            value={localDetails.duration}
            onChange={handleChange}
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

export const isStageOneValid = (jobDetails) => {
  return (
    jobDetails.title.trim() !== '' && 
    jobDetails.description.trim() !== '' && 
    jobDetails.duration !== '' && 
    jobDetails.workLocation !== ''
  );
}; 