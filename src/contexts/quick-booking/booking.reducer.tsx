import { Room } from "@/types";
import { addRoom, calculateTotal, removeRoom } from "./booking.utils";
import { calculateUniqueItems } from "../quick-cart/cart.utils";

interface Metadata {
  [key: string]: any;
}

type Action =
  | { type: "ADD_ROOM"; room: Room; quantity: number }
  //   | { type: 'REMOVE_ITEM_OR_QUANTITY'; id: Item['id']; quantity?: number }
  //   | { type: 'ADD_ITEM'; id: Item['id']; item: Item }
  //   | { type: 'UPDATE_ITEM'; id: Item['id']; item: UpdateItemInput }
  | { type: "REMOVE_ROOM"; id: Room["id"] }
  | { type: "RESET_CART" };

export interface State {
  rooms: Room[];
  isEmpty: boolean;
  //   totalItems: number;
  totalUniqueItems: number;
  total: number;
  //   meta?: Metadata | null;
}

export const initialState: State = {
  rooms: [],
  isEmpty: true,
  //   totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  //   meta: null,
};

export function bookingReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ROOM": {
      const items = addRoom(state.rooms, action.room, action.quantity);
      return generateFinalState(state, items);
    }
    // case 'REMOVE_ITEM_OR_QUANTITY': {
    //   const items = removeItemOrQuantity(
    //     state.items,
    //     action.id,
    //     (action.quantity = 1)
    //   );
    //   return generateFinalState(state, items);
    // }
    // case 'ADD_ITEM': {
    //   const items = addItem(state.items, action.item);
    //   return generateFinalState(state, items);
    // }
    case "REMOVE_ROOM": {
      const items = removeRoom(state.rooms, action.id);
      return generateFinalState(state, items);
    }
    // case 'UPDATE_ITEM': {
    //   const items = updateItem(state.items, action.id, action.item);
    //   return generateFinalState(state, items);
    // }
    case "RESET_CART":
      return initialState;
    default:
      return state;
  }
}

const generateFinalState = (state: State, rooms: Room[]) => {
  const totalUniqueItems = calculateUniqueItems(rooms);
  return {
    ...state,
    rooms: rooms,
    // rooms: calculateItemTotals(items),
    // totalItems: calculateTotalItems(items),
    totalUniqueItems,
    total: calculateTotal(rooms),
    isEmpty: totalUniqueItems === 0,
  };
};
