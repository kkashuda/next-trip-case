import axios from "axios";
import { Direction } from "../types/Direction";
import { NextTripResult } from "../types/NextTripResult";
import { Place } from "../types/Place";
import { Route } from "../types/Route";

// returns a list of transit routes that are in service on the current day
export async function getRoutes() {
  const { data } = await axios.get<Route[]>(
    "https://svc.metrotransit.org/nextripv2/routes",
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return data;
}

// returns the two directions that are valid for a given route
export async function getDirections(routeId: string) {
  const { data } = await axios.get<Direction[]>(
    `https://svc.metrotransit.org/nextripv2/directions/${routeId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return data;
}

// returns a list of stops or "places" that are valid for a given routeId and directionId
export async function getPlaces(routeId: string, directionId: number) {
  const { data } = await axios.get<Place[]>(
    `https://svc.metrotransit.org/nextripv2/stops/${routeId}/${directionId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return data;
}

// returns a list of departure times and a list of alerts for a given stop
export async function getStop(stopId: number) {
  const { data } = await axios.get<NextTripResult>(
    `https://svc.metrotransit.org/nextripv2/${stopId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return data;
}

// returns a list of departures and a list of alerts for a given stop
export async function getNextTrips(
  routeId: string,
  directionId: number,
  placeCode: string
) {
  const { data } = await axios.get<NextTripResult>(
    `https://svc.metrotransit.org/nextripv2/${routeId}/${directionId}/${placeCode}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return data;
}
