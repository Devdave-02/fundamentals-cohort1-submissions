import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { IOrderedProduct } from "../models/Orders";
dayjs.extend(customParseFormat);


export const isDateTime = (dateTime : string) => {
     return dayjs(dateTime, "YYYY-MM-DDTHH:mm:ss", true).isValid() ||
    dayjs(dateTime, "YYYY-MM-DD HH:mm:ss", true).isValid()
}

export function isEnumValue<T extends object>(value: unknown, enumObj: T): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

export const isNullOrEmpty = (value: any): boolean => {
  if (value == null) return true; 

  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;

  return false;
}
export function isOrderProduct(obj: any): obj is any {
  return (
    obj &&
    typeof obj.productId === "string" &&
    typeof obj.quantity === "number"
  );
}
   
