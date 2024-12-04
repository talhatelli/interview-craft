import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Paper,
  Stack,
  TextField,
  Slider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setStage } from "../../store/slices/interviewSlice";
import EditIcon from "@mui/icons-material/Edit";
import { SUMMARY_REVIEW_TEXT } from "../../constants/text";

export default function SummaryReview() {
  const dispatch = useDispatch();
  const { jobDetails, questions } = useSelector((state) => state.interview);

  const handleEditSection = (stage) => {
    dispatch(setStage(stage));
  };

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", p: 3 }}>
      <Card
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: "none",
        }}
      >
        <CardHeader
          title={SUMMARY_REVIEW_TEXT.JOB_DETAILS}
          action={
            <IconButton onClick={() => handleEditSection(1)} size="small" sx={{ color: "text.secondary" }}>
              <EditIcon />
            </IconButton>
          }
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiCardHeader-title": {
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "text.primary",
            },
          }}
        />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: 500, color: "text.primary", marginTop: 1.5 }}>
              {SUMMARY_REVIEW_TEXT.JOB_TITLE}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>{jobDetails.title}</Typography>

            <Typography sx={{ fontWeight: 500, color: "text.primary", marginTop: 1.5 }}>
              {SUMMARY_REVIEW_TEXT.JOB_DESCRIPTION}
            </Typography>
            <Box
              sx={{
                borderRadius: 1,
                overflowWrap: "break-word",
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "pre-wrap",
                "& p": { margin: 0, color: "text.secondary" },
              }}
              dangerouslySetInnerHTML={{
                __html: jobDetails.description || "",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", marginTop: 1.5 }}>
            <Typography sx={{ color: "text.primary" }}>
              {SUMMARY_REVIEW_TEXT.DURATION}
            </Typography>
            <Typography color="text.secondary">{jobDetails.duration} minutes</Typography>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: "none",
        }}
      >
        <CardHeader
          title={SUMMARY_REVIEW_TEXT.QUESTIONS}
          action={
            <IconButton onClick={() => handleEditSection(2)} size="small" sx={{ color: "text.secondary" }}>
              <EditIcon />
            </IconButton>
          }
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "& .MuiCardHeader-title": {
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "text.primary",
              flex: 1,
              textAlign: "center",
            },
          }}
        />

        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {questions.map((question, index) => (
              <Paper key={question.id} sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Question {index + 1}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={question.text}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                    Weightage Score:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", width: "250px", ml: 2 }}>
                    <Slider value={question.weightage} disabled min={0} max={3} valueLabelDisplay="auto" />
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
