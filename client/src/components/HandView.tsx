import { CSSProperties, FC } from "react";
import { Hand, HandWithPrescription } from "../types";
import { Chip } from "@mui/joy";
import { LightbulbOutlined } from "@mui/icons-material";

const CARD_WIDTH = "7vw";
const CARD_HEIGHT = "9.96vw";
const CARD_SPACING = "1vw";

type Props = {
  hands: HandWithPrescription[];
  style?: CSSProperties;
};

const handWidthCssCalcStr = (hand: Hand) =>
  `calc(${CARD_WIDTH} + ${hand.length - 1} * ${CARD_SPACING})`;

const handHeightCssCalcStr = (hand: Hand) =>
  `calc(${CARD_HEIGHT} + ${hand.length - 1} * ${CARD_SPACING})`;

const HandView: FC<Props> = ({ hands: handWithPrescriptions, style }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignSelf: "stretch",
          justifyContent: "space-around",
          flexGrow: 1,
        }}
      >
        {handWithPrescriptions.map(handWithPrescription => (
          <div
            style={{
              width: handWidthCssCalcStr(handWithPrescription.hand),
              height: handHeightCssCalcStr(handWithPrescription.hand),
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {handWithPrescription.hand.map((card, i) => (
              <img
                src={`/${card.suit}_${card.rank}.svg`}
                style={{
                  display: "block",
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  position: "absolute",
                  top: `calc(${i} * ${CARD_SPACING}`,
                  left: `calc(${i} * ${CARD_SPACING}`,
                  boxShadow: "0.2em 0.2em 0.2em rgba(0, 0, 0, .2)",
                }}
              />
            ))}
            {handWithPrescription.prescription && (
              <Chip
                color="primary"
                startDecorator={<LightbulbOutlined fontSize="small" />}
                variant="soft"
                sx={{ zIndex: 3 }}
              >
                {handWithPrescription.prescription}
              </Chip>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandView;
