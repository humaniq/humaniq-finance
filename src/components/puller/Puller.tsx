import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import colors from "utils/colors";

export const Puller = styled(Box)(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: colors.textGrey,
  borderRadius: 3,
  position: "absolute",
  top: 6,
  left: "calc(50% - 15px)",
}));
