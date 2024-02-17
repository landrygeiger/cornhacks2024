import { CSSProperties, FC } from "react";
import { Hand } from "../types";

const CARD_WIDTH = "5vw";
const CARD_SPACING = "1vw";

type Props = {
  hand: Hand;
  style?: CSSProperties;
};

const HandView: FC<Props> = ({ hand, style }) => {
  return (
    <div style={{ position: "relative", ...style }}>
      {hand.map((card, i) => (
        <img
          src={`/${card.suit}_${card.rank}.svg`}
          style={{
            display: "block",
            width: CARD_WIDTH,
            position: "absolute",
            top: `calc(${i} * ${CARD_SPACING})`,
            left: `calc(${i} * ${CARD_SPACING} + 50% - ${CARD_WIDTH} / 2 - ${
              hand.length - 1
            } * ${CARD_SPACING} / 2)`,
          }}
        />
      ))}
    </div>
  );
};

export default HandView;
