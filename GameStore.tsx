/* 
  Context for the dev team.
  
  This is a central MobX store for a React based Magic The Gathering Solo game I was working on.  
  This class follows the signleton patter and manages all of the overarching state.
  Many classes/components will have access to these functions.
*/

import { action, computed, makeObservable, observable } from "mobx";
import { ReactNode } from "react";
import { CardType, Position } from "../../types/model";

type Message = {
  message: ReactNode;
  hasBeenRead: boolean;
};

export class GameStore {
  library: CardType[] = [];
  battlefield: CardType[] = [];
  graveyard: CardType[] = [];
  configuration: any = {};
  numberOfCardsToDraw = 2;
  messageList: Message[] = [];

  constructor() {
    makeObservable(this, {
      library: observable,
      hand: computed,
      battlefield: observable,
      graveyard: observable,
      numberOfCardsToDraw: observable,
      messageList: observable,

      sendCardToGraveyard: action.bound,
      drawCards: action.bound,
      untapAll: action.bound,
      tapAll: action.bound,
      toggleIsTapped: action.bound,
      addNewMessage: action.bound,
      accelerateGame: action.bound,
      initializeDeck: action.bound,
      addCardsToBattlefield: action.bound,
    });
  }

  initializeDeck = (decklist: CardType[]) => {
    this.library = decklist;
  };

  get hand() {
    return this.library.slice(0, 5);
  }

  findEmptyCardSpace = () => {
    return this.getPossiblePosition();
  };

  getPossiblePosition = () => {
    let numberOfRows = 2;

    for (let i = 0; i < numberOfRows; i++) {
      const position = this.getPossibleXPosition(i);
      if (position) {
        return position;
      }
    }

    return {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    };
  };

  getPossibleXPosition = (y: number) => {
    let numberOfColumns = 7;
    if (window.innerWidth) {
      numberOfColumns = window.innerWidth / 200 - 1;
    }

    for (let i = 0; i < numberOfColumns; i++) {
      const matchingCard = this.battlefield.find((card) => {
        if (card.position) {
          const xPosition = i * 200;
          const isCardInXPosition =
            xPosition <= card?.position?.x &&
            card?.position?.x <= xPosition + 200;
          const yPosition = y * 300;
          const isCardInYPosition =
            yPosition <= card.position?.y &&
            card.position?.y <= yPosition + 300;

          return isCardInXPosition && isCardInYPosition;
        }
        return false;
      });

      if (!matchingCard) {
        return { x: i * 200, y: y * 300 };
      }
    }

    return undefined;
  };

  addCardsToBattlefield = (card: CardType) => {
    card.position = this.findEmptyCardSpace();
    this.battlefield.push(card);
  };

  drawCards = (numberOfCards: number = 2) => {
    if (this.library.length >= numberOfCards) {
      for (let i = 0; i < numberOfCards; i++) {
        const drawnCard = this.library.splice(
          Math.random() * this.hand.length,
          1
        )[0];
        this.addCardsToBattlefield(drawnCard);
      }
    } else {
      const drawnCards = this.hand.splice(0, numberOfCards);
      drawnCards.forEach((card) => {
        this.battlefield.push(card);
      });
    }
  };

  untapAll = () => {
    this.battlefield.forEach((card) => {
      if (card.type === "Creature") {
        card.isTapped = false;
        card.hasSummoningSickness = false;
      }
    });
  };

  tapAll = () => {
    this.battlefield.forEach((card) => {
      if (card.type === "Creature" && !card.hasSummoningSickness) {
        card.isTapped = true;
      }
    });
  };

  toggleIsTapped = (key: string) => {
    const updateIndex = this.battlefield.findIndex((card) => card.key === key);

    if (this.battlefield[updateIndex].type === "Creature") {
      this.battlefield[updateIndex].isTapped =
        !this.battlefield[updateIndex].isTapped;
    }
  };

  startANewTurn = () => {
    this.untapAll();
    this.drawCards();
  };

  updateCardPosition = (key: string, newPosition: Position) => {
    const updateIndex = this.battlefield.findIndex((card) => card.key === key);

    this.battlefield[updateIndex].position = newPosition;
  };

  sendCardToGraveyard = (key: string) => {
    const updateIndex = this.battlefield.findIndex((card) => card.key === key);

    const [removedCard] = this.battlefield.splice(updateIndex, 1);

    this.graveyard.push(removedCard);
    if ("onDeath" in removedCard && removedCard.onDeath) {
      removedCard.onDeath();
    }
  };

  addNewMessage = (newMessage: ReactNode) => {
    const message = { message: newMessage, hasBeenRead: false };
    this.messageList.push(message);
  };

  accelerateGame = () => {
    this.numberOfCardsToDraw = this.numberOfCardsToDraw + 1;
  };
}
