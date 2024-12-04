import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, TextField, Typography, FormControl, Select, MenuItem } from "@mui/material";
import RichTextEditor from "../common/RichTextEditor";
import { fetchInterviewDetails, setJobDetails } from "../../store/slices/interviewSlice";
import styles from "../../styles/InterviewStages.module.scss";
import JobLocationSelector from "./JobLocationSelector";
import { JOB_DETAILS_TEXT } from "../../constants/text";

const initialDetails = {
  title: "",
  description: "",
  duration: "10",
  workLocation: "onsite",
};

const durationOptions = ["10", "15", "20", "30", "45", "60"];

export default function JobDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const interviewId = router.query.id;
  const interview = useSelector((state) => state.interview.selectedInterview);
  const currentJobDetails = useSelector((state) => state.interview.jobDetails);
  const [localDetails, setLocalDetails] = useState(initialDetails);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewDetails(interviewId));
    }
  }, [interviewId, dispatch]);

  useEffect(() => {
    if (interviewId && interview?.jobDetails && !localDetails.title) {
      setLocalDetails(interview.jobDetails);
    } else if (!interviewId && currentJobDetails && Object.keys(currentJobDetails).length > 0) {
      setLocalDetails({
        title: currentJobDetails.title || "",
        description: currentJobDetails.description || "",
        duration: currentJobDetails.duration || "10",
        workLocation: currentJobDetails.workLocation || "onsite",
      });
    }
  }, [interview, currentJobDetails, interviewId]);

  const validateForm = (details = localDetails) => {
    const newErrors = {};
    if (!details?.title?.trim()) {
      newErrors.title = JOB_DETAILS_TEXT.JOB_TITLE_ERROR;
    }
    if (!details?.description?.trim()) {
      newErrors.description = JOB_DETAILS_TEXT.JOB_DESCRIPTION_ERROR;
    }
    if (!details?.duration) {
      newErrors.duration = JOB_DETAILS_TEXT.DURATION_ERROR;
    }
    if (!details?.workLocation) {
      newErrors.workLocation = JOB_DETAILS_TEXT.WORK_LOCATION_ERROR;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value?.trim()) {
          error = JOB_DETAILS_TEXT.JOB_TITLE_ERROR;
        }
        break;
      case "description":
        if (!value?.trim()) {
          error = JOB_DETAILS_TEXT.JOB_DESCRIPTION_ERROR;
        }
        break;
      case "duration":
        if (!value) {
          error = JOB_DETAILS_TEXT.DURATION_ERROR;
        }
        break;
      case "workLocation":
        if (!value) {
          error = JOB_DETAILS_TEXT.WORK_LOCATION_ERROR;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newDetails = {
      ...localDetails,
      [name]: value,
    };
    setLocalDetails(newDetails);

    if (name !== "title" || value.trim() !== "") {
      dispatch(setJobDetails(newDetails));
    }
  };

  const handleEditorChange = (text) => {
    const newDetails = {
      ...localDetails,
      description: text,
    };
    setLocalDetails(newDetails);
    dispatch(setJobDetails(newDetails));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value !== undefined) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleEditorBlur = () => {
    if (localDetails.description !== undefined) {
      const error = validateField("description", localDetails.description);
      setErrors((prev) => ({
        ...prev,
        description: error,
      }));
    }
  };

  return (
    <Box className={styles.stageContainer}>
      <Typography variant="h5" gutterBottom>
        {JOB_DETAILS_TEXT.TITLE}
      </Typography>

      <Box className={styles.form}>
        <TextField
          fullWidth
          label={JOB_DETAILS_TEXT.JOB_TITLE_LABEL}
          name="title"
          value={localDetails?.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.title}
          helperText={errors.title}
          className={styles.formField}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#6200ee",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#6200ee",
            },
          }}
        />

        <Box className={styles.editorContainer}>
          <RichTextEditor
            value={localDetails?.description}
            onChange={handleEditorChange}
            onBlur={handleEditorBlur}
            error={!!errors.description}
            placeholder={JOB_DETAILS_TEXT.DESCRIPTION_PLACEHOLDER}
            height="300px"
          />
          {errors.description && <Typography className={styles.error}>{errors.description}</Typography>}
        </Box>

        <FormControl fullWidth>
          <Select
            name="duration"
            value={localDetails?.duration}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.duration}
            sx={{
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6200ee",
              },
            }}
          >
            {durationOptions.map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration} {JOB_DETAILS_TEXT.MINUTES}
              </MenuItem>
            ))}
          </Select>
          {errors.duration && <Typography className={styles.error}>{errors.duration}</Typography>}
        </FormControl>

        <JobLocationSelector
          value={localDetails?.workLocation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.workLocation}
        />
      </Box>
    </Box>
  );
}

export const isStageOneValid = (jobDetails) => {
  return (
    jobDetails?.title?.trim() !== "" &&
    jobDetails?.description?.trim() !== "" &&
    jobDetails?.duration?.trim() !== "" &&
    jobDetails?.workLocation?.trim() !== "" &&
    jobDetails?.duration !== undefined &&
    jobDetails?.workLocation !== undefined
  );
};
