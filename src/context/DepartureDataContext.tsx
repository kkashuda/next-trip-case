import { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { NextTripResult } from "../types/NextTripResult";

const Context = createContext<AppContextInterface | null>(null);

export function useDepartureDataContext() {
  return useContext(Context);
}

interface Props {
  children: any;
}

export interface AppContextInterface {
  selectedRoute: string;
  setSelectedRoute: Function;
  selectedDirection: number;
  setSelectedDirection: Function;
  selectedPlace: string;
  setSelectedPlace: Function;
  nextTrips: NextTripResult | undefined;
  setNextTrips: Function;
  stopId: number;
  setStopId: Function;
  invalidStopId: boolean;
  setInvalidStopId: Function;
  searchParams: URLSearchParams;
  setSearchParams: Function;
}

export default function DepartureDataContext({ children }: Props) {
  // form input state
  const [selectedRoute, setSelectedRoute] = useState<string>("default");
  const [selectedDirection, setSelectedDirection] = useState<number>(-1);
  const [selectedPlace, setSelectedPlace] = useState<string>("default");
  const [stopId, setStopId] = useState<number>(-1);

  // departure data
  const [nextTrips, setNextTrips] = useState<NextTripResult>();

  // error handling state
  const [invalidStopId, setInvalidStopId] = useState<boolean>(false);

  // query string parameter state
  const [searchParams, setSearchParams] = useSearchParams();

  const value = {
    selectedRoute,
    setSelectedRoute,
    selectedDirection,
    setSelectedDirection,
    selectedPlace,
    setSelectedPlace,
    nextTrips,
    setNextTrips,
    stopId,
    setStopId,
    invalidStopId,
    setInvalidStopId,
    searchParams,
    setSearchParams,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

DepartureDataContext.propTypes = {
  children: PropTypes.node,
};
