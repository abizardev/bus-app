import { BusSchedule } from '../data/mockData';

export interface ScheduleSearchParams {
  originCity?: string;
  destinationCity?: string;
  serviceTier?: string;
  maxPrice?: number;
  minAvailableSeats?: number;
  timeWindow?: 'pagi' | 'siang' | 'malam'; // pagi: 05:00-11:59, siang: 12:00-17:59, malam: 18:00-04:59
}

export type SortCriterion = 'price_asc' | 'price_desc' | 'earliest' | 'latest' | 'duration';

function parseDurationMinutes(durationStr: string): number {
  const hoursMatch = durationStr.match(/(\d+)j/);
  const minsMatch = durationStr.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
  return hours * 60 + mins;
}

/**
 * Searches and filters bus schedules based on multi-criteria filter.
 */
export function searchAndFilterSchedules(
  schedules: BusSchedule[],
  params: ScheduleSearchParams
): BusSchedule[] {
  return schedules.filter((schedule) => {
    if (
      params.originCity &&
      !schedule.departureCity.toLowerCase().includes(params.originCity.toLowerCase())
    ) {
      return false;
    }

    if (
      params.destinationCity &&
      !schedule.arrivalCity.toLowerCase().includes(params.destinationCity.toLowerCase())
    ) {
      return false;
    }

    if (
      params.serviceTier &&
      !schedule.serviceTier.toLowerCase().includes(params.serviceTier.toLowerCase())
    ) {
      return false;
    }

    if (params.maxPrice !== undefined && schedule.pricePerSeat > params.maxPrice) {
      return false;
    }

    if (
      params.minAvailableSeats !== undefined &&
      schedule.availableSeats < params.minAvailableSeats
    ) {
      return false;
    }

    if (params.timeWindow) {
      const hour = parseInt(schedule.departureTime.split(':')[0], 10);
      if (params.timeWindow === 'pagi' && !(hour >= 5 && hour < 12)) {
        return false;
      }
      if (params.timeWindow === 'siang' && !(hour >= 12 && hour < 18)) {
        return false;
      }
      if (params.timeWindow === 'malam' && !(hour >= 18 || hour < 5)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts schedules according to criterion.
 */
export function sortSchedules(
  schedules: BusSchedule[],
  criterion: SortCriterion
): BusSchedule[] {
  const list = [...schedules];

  switch (criterion) {
    case 'price_asc':
      return list.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    case 'price_desc':
      return list.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    case 'earliest':
      return list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    case 'latest':
      return list.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
    case 'duration':
      return list.sort(
        (a, b) => parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration)
      );
    default:
      return list;
  }
}
