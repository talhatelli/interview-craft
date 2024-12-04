import { Box, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "../../styles/InterviewStages.module.scss";
import { STEPPER_STEPS } from "../../constants/text";

const CustomStep = ({ step, index, currentStage }) => {
  const stepNumber = index + 1;
  const isCompleted = stepNumber < currentStage;
  const isActive = stepNumber === currentStage;
  const isNotReached = stepNumber > currentStage;

  return (
    <div
      className={clsx(styles.customStep, {
        [styles.completed]: isCompleted,
        [styles.active]: isActive,
        [styles.notReached]: isNotReached,
      })}
    >
      <div className={styles.stepContent}>
        <Box sx={{ height: "80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography
            variant="h6"
            className={styles.stepLabel}
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: "0.88rem",
            }}
          >
            {step.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.stepSubtitle}
            sx={{
              fontSize: "0.75rem",
              lineHeight: 1.2,
            }}
          >
            {step.subtitle}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default function CustomStepper({ currentStage }) {
  return (
    <div className={styles.stepsContainer}>
      {STEPPER_STEPS.map((step, index) => (
        <CustomStep key={step.title} step={step} index={index} currentStage={currentStage} />
      ))}
    </div>
  );
}
