import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import styles from '../../styles/InterviewStages.module.scss';
import { JOB_LOCATION_TEXT } from '../../constants/text';

export default function JobLocationSelector({ value, onChange, error }) {
  return (
    <Box className={styles.locationSection}>
      <Typography gutterBottom fontWeight="bold">
        {JOB_LOCATION_TEXT.TITLE}
      </Typography>
      <RadioGroup
        name="workLocation"
        value={value}
        onChange={onChange}
        row
        sx={{
          '& .MuiRadio-root.Mui-checked': {
            color: '#6200ee'
          }
        }}
      >
        <FormControlLabel
          value="remote"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1">{JOB_LOCATION_TEXT.REMOTE.LABEL}</Typography>
              <Typography variant="caption" color="textSecondary">
                {JOB_LOCATION_TEXT.REMOTE.DESCRIPTION}
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="hybrid"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1">{JOB_LOCATION_TEXT.HYBRID.LABEL}</Typography>
              <Typography variant="caption" color="textSecondary">
                {JOB_LOCATION_TEXT.HYBRID.DESCRIPTION}
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="onsite"
          control={<Radio />}
          label={
            <Box>
              <Typography variant="body1">{JOB_LOCATION_TEXT.ONSITE.LABEL}</Typography>
              <Typography variant="caption" color="textSecondary">
                {JOB_LOCATION_TEXT.ONSITE.DESCRIPTION}
              </Typography>
            </Box>
          }
        />
      </RadioGroup>
      {error && (
        <Typography className={styles.error}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
