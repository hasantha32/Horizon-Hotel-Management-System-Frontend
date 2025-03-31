import React, { useCallback } from "react";
import { Room } from "@/types";
import { bookingReducer, initialState, State } from "./booking.reducer";
import { useLocalStorage } from "@/utils/use-local-storage";
import { BOOKING_KEY } from "@/utils/constants";
import { useAtom } from "jotai";
import { getRoom } from "./booking.utils";

interface BookingProviderState extends State {
  addRoomToCart: (room: Room, quantity: number) => void;
  isRoomInCart: (id: Room["id"]) => boolean;

  removeRoomFromCart: (id: Room["id"]) => void;
    clearRoomFromCart: (id: Room['id']) => void;
  //   getItemFromCart: (id: Item['id']) => any | undefined;
  //   isInCart: (id: Item['id']) => boolean;
  //   isInStock: (id: Item['id']) => boolean;
    resetCart: () => void;
}

export const bookingContext = React.createContext<
  BookingProviderState | undefined
>(undefined);

bookingContext.displayName = "BookingContext";

export const useBooking = () => {
  const context = React.useContext(bookingContext);
  if (context === undefined) {
    throw new Error(`useBooking must be used within a BookingProvider`);
  }
  return context;
};

export const BookingProvider: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
  const [savedBooking, saveBooking] = useLocalStorage(
    BOOKING_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    bookingReducer,
    JSON.parse(savedBooking!)
  );
  // const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  // React.useEffect(() => {
  //   emptyVerifiedResponse(null);
  // }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveBooking(JSON.stringify(state));
  }, [state, saveBooking]);

  const addRoomToCart = (room: Room, quantity: number) =>
    dispatch({ type: "ADD_ROOM", room, quantity });
  const removeRoomFromCart = (id: Room["id"]) =>
    dispatch({ type: "REMOVE_ROOM", id });
  // const clearItemFromCart = (id: Item['id']) =>
  //   dispatch({ type: 'REMOVE_ITEM', id });
  const isRoomInCart = useCallback(
    (id: Room["id"]) => !!getRoom(state.rooms, id),
    [state.rooms]
  );
  // const getItemFromCart = useCallback(
  //   (id: Item['id']) => getItem(state.items, id),
  //   [state.items]
  // );
  // const isInStock = useCallback(
  //   (id: Item['id']) => inStock(state.items, id),
  //   [state.items]
  // );
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      addRoomToCart,
      removeRoomFromCart,
      isRoomInCart,
      // removeItemFromCart,
      // clearItemFromCart,
      // getItemFromCart,
      // isInCart,
      // isInStock,
      resetCart,
    }),
    //   [getItemFromCart, isInCart, isInStock, state]
    [state]
  );
  return <bookingContext.Provider value={value} {...props} />;
};
