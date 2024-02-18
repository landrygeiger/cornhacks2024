import { CSSProperties, FC } from "react";
import { Hand } from "../types";

const CARD_WIDTH = "7vw";
const CARD_HEIGHT = "9.96vw";
const CARD_SPACING = "1vw";

type Props = {
  hands: Hand[];
  style?: CSSProperties;
};

const handWidthCssCalcStr = (hand: Hand) =>
  `calc(${CARD_WIDTH} + ${hand.length - 1} * ${CARD_SPACING})`;

const handHeightCssCalcStr = (hand: Hand) =>
  `calc(${CARD_HEIGHT} + ${hand.length - 1} * ${CARD_SPACING})`;

const HandView: FC<Props> = ({ hands, style }) => {
  return (
    <div
      style={{
        display: "flex",
        ...style,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {hands.map(hand => (
        <div
          style={{
            width: handWidthCssCalcStr(hand),
            height: handHeightCssCalcStr(hand),
            position: "relative",
          }}
        >
          {hand.map((card, i) => (
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
        </div>
      ))}
    </div>
  );
};

export default HandView;
