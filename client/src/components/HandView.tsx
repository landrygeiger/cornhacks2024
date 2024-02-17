import { FC } from "react";
import { Hand } from "../types";

type Props = {
  hand: Hand;
};

const HandView: FC<Props> = ({ hand }) => {
  return (
    <div style={{ position: "relative" }}>
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
