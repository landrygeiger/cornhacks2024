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
        alignItems: "center",
        gap: "1vw",
        ...style,
        margin: 0,
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
