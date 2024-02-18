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
            width: "8vw",
            boxShadow: "0.2em 0.2em 0.2em rgba(0, 0, 0, .2)",
          }}
        />
      ))}
    </div>
  );
};

export default DealerHandView;
