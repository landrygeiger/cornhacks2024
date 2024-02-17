import { CSSProperties, FC } from "react";
import { Hand } from "../types";

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
            width: "5vw",
            position: "absolute",
            top: `${1 * i}vw`,
            left: `${1 * i}vw`,
          }}
        />
      ))}
    </div>
  );
};

export default HandView;
