import { CSSProperties, FC } from "react";
import { Hand } from "../types";

type Props = {
  hand: Hand;
  style?: CSSProperties;
};

const DealerHandView: FC<Props> = ({ hand, style }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1vw",
        ...style,
      }}
    >
      {hand.map(card => (
        <img
          src={`/${card.suit}_${card.rank}.svg`}
          style={{
            width: "5vw",
          }}
        />
      ))}
    </div>
  );
};

export default DealerHandView;
