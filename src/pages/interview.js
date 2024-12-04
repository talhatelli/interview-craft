import { Box, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setStage } from "../store/slices/interviewSlice";
import JobDetails from "../components/InterviewStages/JobDetails";
import ConfigureQuestions from "../components/InterviewStages/ConfigureQuestions";
import SummaryReview from "../components/InterviewStages/SummaryReview";
import styles from "../styles/InterviewStages.module.scss";
import { isStageOneValid } from "../components/InterviewStages/JobDetails";
import { isStageTwoValid } from "../components/InterviewStages/ConfigureQuestions";
import { publishInterview, resetForm, clearPublishSuccess, updateInterviewThunk } from "../store/slices/interviewSlice";
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import CustomStepper from "../components/InterviewStages/CustomStepper";
import BackButton from "../components/common/BackButton";
import PublishDialog from "../components/InterviewStages/PublishDialog";
import { ROUTES } from "../constants/routes";
import { STORAGE_KEYS } from "../constants/storage";
import { ALERT_TEXT, NAVIGATION_TEXT, INTERVIEW_PAGE_TEXT } from "../constants/text";

export default function Interview() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const currentStage = useSelector((state) => state.interview.stage);
  const jobDetails = useSelector((state) => state.interview.jobDetails);
  const questions = useSelector((state) => state.interview.questions);
  const { isLoading, publishSuccess, updateSuccess } = useSelector((state) => state.interview);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const handleNext = () => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_APP_STATE, JSON.stringify(currentStage));
    dispatch(setStage(currentStage + 1));
  };

  const handleBack = () => {
    if (currentStage === 1) {
      router.push(ROUTES.HOME);
    } else {
      dispatch(setStage(currentStage - 1));
    }
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

  const handlePublishClick = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublishConfirm = async () => {
    setIsPublishDialogOpen(false);
    try {
      if (id) {
        await dispatch(updateInterviewThunk({ id, jobDetails, questions })).unwrap();
        setTimeout(() => {
          router.push(ROUTES.HOME);
          dispatch(resetForm());
        }, 2000);
      } else {
        await dispatch(publishInterview()).unwrap();
        setTimeout(() => {
          router.push(ROUTES.HOME);
          dispatch(resetForm());
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to publish/update interview:", error);
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(clearPublishSuccess());
  };

  return (
    <Box className={styles.mainContainer}>
      <div className={styles.stepperContainer}>
        <div className={styles.stepperWrapper}>
          <BackButton onClick={handleBack} />
          <CustomStepper currentStage={currentStage} />
        </div>
      </div>

      <Box className={styles.contentScrollArea}>
        <Box className={styles.stageContent}>{renderStage()}</Box>
      </Box>

      <Box className={styles.stickyNavigation}>
        {currentStage < 3 ? (
          <>
            <BackButton onClick={handleBack} />
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isNextButtonEnabled()}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
                minWidth: "80px",
                boxShadow: "none",
                backgroundColor: "#6200ee",
                "&:hover": {
                  backgroundColor: "#6200ee",
                  opacity: 0.9,
                  boxShadow: "none",
                },
                "&:disabled": {
                  backgroundColor: "rgba(98, 0, 238, 0.12)",
                },
              }}
            >
              {NAVIGATION_TEXT.NEXT}
            </Button>
          </>
        ) : (
          <>
            <BackButton onClick={handleBack} disabled={isLoading} />
            <Button
              variant="contained"
              onClick={handlePublishClick}
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
                minWidth: "80px",
                boxShadow: "none",
                backgroundColor: "#6200ee",
                "&:hover": {
                  backgroundColor: "#6200ee",
                  opacity: 0.9,
                  boxShadow: "none",
                },
                "&:disabled": {
                  backgroundColor: "rgba(98, 0, 238, 0.12)",
                },
              }}
            >
              {isLoading
                ? INTERVIEW_PAGE_TEXT.PUBLISHING
                : id
                ? INTERVIEW_PAGE_TEXT.UPDATE_INTERVIEW
                : INTERVIEW_PAGE_TEXT.PUBLISH_INTERVIEW}
            </Button>
          </>
        )}
      </Box>

      <PublishDialog
        open={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onConfirm={handlePublishConfirm}
        isEdit={!!id}
      />

      <Snackbar
        open={publishSuccess || updateSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: "100%",
            "& .MuiAlert-icon": {
              color: "#6200ee",
            },
          }}
        >
          {ALERT_TEXT.GENERIC_SUCCESS.replace("{action}", id ? "updated" : "published")}
        </Alert>
      </Snackbar>
    </Box>
  );
}
