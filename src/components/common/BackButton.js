import { Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import styles from "@/styles/components/BackButton.module.scss";
import { BACK_BUTTON_TEXT } from "@/constants/text";

export default function BackButton({ onClick, sx = {}, disabled = false }) {
  return (
    <Button
      startIcon={<ChevronLeftIcon />}
      onClick={onClick}
      disabled={disabled}
      className={styles.backButton}
      sx={{ color: 'text.secondary', ...sx }}
    >
      {BACK_BUTTON_TEXT.LABEL}
    </Button>
  );
}
