import { AxiosError } from "axios";
import { NextTripResult } from "../types/NextTripResult";

export const mockRouteData = [
  { route_id: "901", agency_id: 0, route_label: "METRO Blue Line" },
  { route_id: "991", agency_id: 0, route_label: "Blue Line Bus" },
  { route_id: "902", agency_id: 0, route_label: "METRO Green Line" },
  { route_id: "904", agency_id: 0, route_label: "METRO Orange Line" },
  { route_id: "903", agency_id: 0, route_label: "METRO Red Line" },
  { route_id: "921", agency_id: 0, route_label: "METRO A Line" },
  { route_id: "923", agency_id: 0, route_label: "METRO C Line" },
  { route_id: "906", agency_id: 10, route_label: "Airport Shuttle" },
];

export const mockDirectionData = [
  { direction_id: 0, direction_name: "Northbound" },
  { direction_id: 1, direction_name: "Southbound" },
];

export const mockStopsData = [
  {
    place_code: "HHTE",
    description: "MSP Airport Terminal 2 - Humphrey Station",
  },
  {
    place_code: "LIND",
    description: "MSP Airport Terminal 1 - Lindbergh Station",
  },
  { place_code: "FTSN", description: "Fort Snelling Station" },
  { place_code: "VAMC", description: "VA Medical Center Station" },
];

export const mockNextRoutesData: NextTripResult = {
  stops: [
    {
      stop_id: 51434,
      latitude: 44.88077,
      longitude: -93.204922,
      description: "Terminal 1 Lindbergh Station",
    },
  ],
  alerts: [],
  departures: [
    {
      actual: true,
      trip_id: "22678927-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "4 Min",
      departure_time: 1661039700,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22679012-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "7:10",
      departure_time: 1661040600,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678922-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "7:25",
      departure_time: 1661041500,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678928-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "7:40",
      departure_time: 1661042400,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678931-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "7:55",
      departure_time: 1661043300,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678932-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "8:10",
      departure_time: 1661044200,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678933-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "8:25",
      departure_time: 1661045100,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
    {
      actual: false,
      trip_id: "22678929-AUG22-RAIL-Saturday-02",
      stop_id: 51434,
      departure_text: "8:40",
      departure_time: 1661046000,
      description: "to Mpls-Target Field",
      route_id: "901",
      route_short_name: "Blue",
      direction_id: 0,
      direction_text: "NB",
      schedule_relationship: "Scheduled",
    },
  ],
};

export const axiosError: AxiosError = {
  message: "Request failed with status code 400",
  name: "AxiosError",
  isAxiosError: true,
  toJSON: () => ({}),
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    transformRequest: [],
    transformResponse: [],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: undefined,
    },
    headers: {
      Accept: "application/json",
    },
    method: "get",
    url: "https://svc.metrotransit.org/nextripv2/1234",
  },
  code: "ERR_BAD_REQUEST",
  status: "400",
};