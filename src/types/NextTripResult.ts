import { AlertMessage } from "./AlertMessage";
import { Departure } from "./Departure";
import { Stop } from "./Stop";

export interface NextTripResult {
  stops: Stop[];
  alerts: AlertMessage[];
  departures: Departure[];
}
