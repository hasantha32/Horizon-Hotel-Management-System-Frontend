import { Room } from "@/types";

export function addRoom(rooms: Room[], room: Room, quantity: number) {
  return [...rooms, room];
}

export function removeRoom(rooms: Room[], id: Room["id"]) {
  return rooms.filter((existingItem) => existingItem.id !== id);
}

export function getRoom(rooms: Room[], id: Room["id"]) {
  return rooms.find((room) => room.id === id);
}

export const calculateTotal = (rooms: Room[]) =>
  rooms.reduce((total, room) => total + Number(room.price), 0);
