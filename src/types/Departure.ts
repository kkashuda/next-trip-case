export interface Departure {
  actual: boolean;
  trip_id: string;
  stop_id: number;
  departure_text: string;
  departure_time: number;
  description: string;
  route_id: string;
  route_short_name: string;
  direction_id: number;
  direction_text: string;
  schedule_relationship: string;
}
