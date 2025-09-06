import * as api from "../api/index";

export const CountersService = {
  getAttendanceCountTimeWise,
};

async function getAttendanceCountTimeWise(values: {
  date: string;
  calculateCounts: boolean;
  fetchClockedInNotClockedOutUsers: boolean;
  fetchClockedInAndClockedOutUsers: boolean;
  fetchLateUsers: boolean;
  fetchOnLeaveUsers: boolean;
}) {
  try {
    const data = (await api.countUsersByAttendance(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}
