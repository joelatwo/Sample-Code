/* 
  Context for the dev team. 
  
  This component pairs nicely with the GameStore MobX file.
  This is where the user would access and change the state as they progress.
  Due to the nature of the personal project I was still in the process of determining the overall architecture.
  Therefore I choose to keep these files in 1 location and clean them up once this was more refined.
*/

import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import CardBack from "../../assets/Magic_card_back.webp";
import { CardType } from "../../types/model";
import { Card } from "../Card";
import { useGameStore } from "../Game/GameProvider";
import styles from "./PlayMenu.module.scss";

// TODO: Move this into it's own file where it would be more appropriate.
export const PlayMenu = observer((): JSX.Element => {
  const {
    untapAll,
    tapAll,
    drawCards,
    hand,
    library,
    startANewTurn,
    graveyard,
  } = useGameStore();

  return (
    <menu className={styles["play-menu"]}>
      <Library library={library} startANewTurn={startANewTurn}></Library>

      <Graveyard graveyard={graveyard}></Graveyard>
      <Hand hand={hand}></Hand>
      <ActionsMenu defaultHp={50} />
    </menu>
  );
});

type ActionsMenuProps = { defaultHp: number };

const ActionsMenu = observer(({ defaultHp }: ActionsMenuProps) => {
  const [offsetFromPreviousUpdate, setOffsetFromPreviousUpdate] =
    useState<number>(0);
  const [currentHp, setCurrentHp] = useState<number>(defaultHp);
  const [turnCount, setTurnCount] = useState(0);

  const { untapAll, tapAll, startANewTurn } = useGameStore();

  const startNextTurn = () => {
    setTurnCount((prev) => prev + 1);
    setOffsetFromPreviousUpdate(0);
    startANewTurn();
  };

  return (
    <div className={styles["game-controls"]}>
      <div>Turn: {turnCount}</div>
      <Button
        onClick={() => {
          setCurrentHp((prev) => prev - 1);
          setOffsetFromPreviousUpdate((prev) => prev - 1);
        }}
      >
        -
      </Button>
      <TextField
        onChange={(event) => {
          const newValue = parseInt(event.target.value);
          if (!isNaN(newValue)) {
            setCurrentHp(newValue);
          }
        }}
        id="Current HP"
        label={`HP for the Horde ${
          offsetFromPreviousUpdate ? offsetFromPreviousUpdate : ""
        }`}
        value={currentHp}
      />
      <Button
        onClick={() => {
          setCurrentHp((prev) => prev + 1);
          setOffsetFromPreviousUpdate((prev) => prev + 1);
        }}
      >
        +
      </Button>{" "}
      <Button onClick={startNextTurn}>Next Turn</Button>
      <Button onClick={untapAll}>Untap All</Button>
      <Button onClick={tapAll}>Go to combat</Button>
    </div>
  );
});

type LibraryProps = {
  library: CardType[];
  startANewTurn: VoidFunction;
};

// TODO: Move this into it's own file.
const Library = ({ library, startANewTurn }: LibraryProps) => {
  return (
    <div className="library" onClick={startANewTurn}>
      <div>Library {library?.length}</div>
      {library?.length > 0 ? (
        <Card
          className={styles["card"]}
          card={{
            id: "Topdeck",
            key: "Topdeck",
            name: "Top of Deck",
            image_uris: { normal: CardBack },
            type: "Other",
          }}
        ></Card>
      ) : (
        <div className={styles["graveyard__placeholder"]}></div>
      )}
    </div>
  );
};

type GraveyardProps = {
  graveyard: CardType[];
};

// TODO: Move this into it's own file.
const Graveyard = ({ graveyard }: GraveyardProps) => {
  return (
    <div
      className={styles["graveyard"]}
      onClick={() => {
        // TODO: handle the graveyard.
      }}
    >
      <div>Graveyard</div>
      {graveyard.length > 0 ? (
        <Card
          className={styles["card"]}
          card={{
            key: "GraveYard",
            id: "Graveyard",
            name: graveyard[graveyard.length - 1].name,
            image_uris: graveyard[graveyard.length - 1].image_uris,
            type: "Other",
          }}
        ></Card>
      ) : (
        <Card
          className={styles["card"]}
          card={{
            id: "Topdeck",
            key: "Topdeck",
            name: "Top of Deck",
            image_uris: { normal: CardBack },
            type: "Other",
          }}
        ></Card>
      )}
    </div>
  );
};

type HandProps = {
  hand: CardType[];
};

// TODO: Move this into it's own file.
const Hand = ({ hand }: HandProps) => {
  return (
    <div className={styles["hand-wrapper"]}>
      <div>Potential Cards Coming In</div>
      <div className={styles["hand"]}>
        {hand?.length > 0
          ? hand
              .slice(0, 5)
              .map((card) => (
                <Card
                  key={card.key}
                  className={styles["card"]}
                  card={card}
                ></Card>
              ))
          : null}
      </div>
    </div>
  );
};
