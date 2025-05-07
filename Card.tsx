/* 
  Context for the dev team. 
  
  This component handles the display logic for a given card.
  The goal was to handle the ability for cards to rotate(tap) and be dragged around the screen.
*/

import Image from "next/image";
import React, { DragEventHandler, useEffect, useState } from "react";
import { CardType, Position } from "../../types/model";
import styles from "./Card.module.scss";
import { useGameStore } from "../Game/GameProvider";
import { observer } from "mobx-react-lite";

type IProps = {
  card: CardType;
  sendCardToGraveyard?: (index: string) => void;
  onDragStart?: VoidFunction;
  isDraggable?: boolean;
  initialPosition?: Position;
  updateCardPosition?: any;
  className?: string;
};

export const Card = observer(
  ({
    card,
    sendCardToGraveyard,
    onDragStart,
    isDraggable,
    initialPosition,
    className,
  }: IProps) => {
    const [positionOffset, setPositionOffset] = useState<
      Position | undefined
    >();
    const { toggleIsTapped, updateCardPosition } = useGameStore();

    const onDragStartTemp: DragEventHandler<HTMLDivElement> = (event) => {
      if (card.position) {
        setPositionOffset({
          x: event.clientX - card.position?.x,
          y: event.clientY - card.position?.y,
        });
      } else {
        setPositionOffset({
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const onDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
      if (positionOffset) {
        updateCardPosition(card.key, {
          x: event.clientX - positionOffset.x,
          y: event.clientY - positionOffset.y,
        });
      } else {
        updateCardPosition(card.key, { x: event.clientX, y: event.clientY });
      }
    };

    useEffect(() => {
      switch (card.type) {
        case "Planeswalker":
          if (card.onEnter) {
            card.onEnter();
          }
          break;

        default:
          break;
      }
    }, []);

    return card?.image_uris?.normal ? (
      <div
        id={card.id}
        style={{
          left: card.position?.x,
          top: card.position?.y,
        }}
        draggable={isDraggable}
        onDragStart={onDragStartTemp}
        className={`${styles["card"]} ${className} ${
          styles[card.rarity as string]
        }`}
        onDragEnd={onDragEnd}
      >
        {isDraggable ? (
          <div className={styles["card__header"]}>
            <button
              onClick={
                sendCardToGraveyard
                  ? () => {
                      sendCardToGraveyard(card.key);
                    }
                  : undefined
              }
            >
              X
            </button>
          </div>
        ) : null}
        <div
          onDoubleClick={() => {
            toggleIsTapped(card.key);
          }}
          className={`card__image`}
        >
          <Image
            draggable={false}
            alt={card.name}
            width={200}
            height={300}
            src={card.image_uris.normal}
          />
        </div>
      </div>
    ) : null;
  }
);
