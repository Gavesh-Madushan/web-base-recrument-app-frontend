import * as api from "../api/index";

export const CheckInService = {
  getEmployeeAssignmentList,
  clockIn,
  clockOut,
};

async function getEmployeeAssignmentList({
  pageSize,
  page,
  userId,
  projectProcessingState,
  divisionId,
  projectId,
}: {
  pageSize?: number;
  page?: number;
  userId?: number;
  projectProcessingState?: "PENDING" | "ONGOING" | "COMPLETED";
  divisionId?: number;
  projectId?: number;
}) {
  try {
    const data = (await api.getProjectEmployeeAssignments({
      pageSize,
      page,
      userId,
      projectProcessingState,
      divisionId,
      projectId,
    })).data
    return { isSuccess: true, data };
  } catch (error) {
    return { isSuccess: false, error: error };
  }
}

async function clockIn({
  projectId,
  createdLocation,
}: {
  projectId: number | null;
  createdLocation: [lat: number, long: number];
}) {
  try {
    const data = (await api.clockIn({ projectId, createdLocation})).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function clockOut({ endedLocation, comment }: { endedLocation: [lat: number, long: number]; comment: string | null }) {
  try {
    const { data } = await api.clockOut({endedLocation, comment});
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}
