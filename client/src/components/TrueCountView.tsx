import { Timeline } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FC } from "react";

type Props = {
  trueCount: number;
  sx?: SxProps;
};

const formatTrueCount = (trueCount: number) =>
  `${trueCount >= 0 ? "+" : ""}${trueCount.toFixed(2)}`;

const TrueCountView: FC<Props> = ({ trueCount, sx }) => {
  return (
    <Alert
      sx={{
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        // borderBottomLeftRadius: 0,
        // top: 0,
        // left: 0,
        ...sx,
      }}
      size="sm"
      color="neutral"
      startDecorator={<Timeline />}
    >
      True Count {formatTrueCount(trueCount)}
    </Alert>
  );
};

export default TrueCountView;
