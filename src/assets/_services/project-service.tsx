import * as api from "../api/index";

export const ProjectService = {
  getClientList,
  createNewClient,
  updateClientDetails,
  getClientDetailsBy,

  getProjectList,
  createProject,
  updateProject,
  getProjectDetailsById,
  startProject,
  endProject,
  getTeamMembers,
  updateProjectTeam,

  getPendingAttendaceList,
};

async function getClientList(
  values: {
    activeState: "ACTIVE" | "INACTIVE" | undefined;
    searchTerm: string | undefined;
  },
  page: number,
  pageSize: number
) {
  try {
    const data = (await api.getClientList(values, page, pageSize)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}

async function createNewClient(values: {
  company_name: string;
  company_contact: string | null;
  company_address: string | null;
  company_email: string | null;
  person_name: string | null;
  person_contact: string | null;
  status: "ACTIVE" | "INACTIVE";
  discription: string | null;
}) {
  try {
    const { data } = await api.createNewClient(values);
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}

async function updateClientDetails(values: {
  id: number;
  company_name: string;
  company_contact: string | null;
  company_address: string | null;
  company_email: string | null;
  person_name: string | null;
  person_contact: string | null;
  status: "ACTIVE" | "INACTIVE";
  discription: string | null;
}) {
  try {
    const data = await api.updateClientDetails(values);
    return { isSuccess: true as const, data: data };
  } catch (error) {
    return { isSuccess: false as const, data: error };
  }
}

async function getClientDetailsBy(values: { id: number }) {
  try {
    const data = await api.getClientDetailsBy(values);
    return { isSuccess: true, data: data };
  } catch (error) {
    return { isSuccess: false, data: error };
  }
}

async function getProjectList(
  values: {
    clientId?: number;
    divisionId?: number;
    state?: "PENDING" | "ONGOING" | "COMPLETED";
    searchTerm?: string;
    isOutstation?: boolean;
  },
  page: number,
  pageSize: number
) {
  try {
    const data = (await api.getProjectList(values, page, pageSize)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function createProject(values: {
  name: string;
  location: number[];
  divisionId: number;
  clientId: number;
  isOutstation: boolean;
  description: string;
  address: string;
}) {
  try {
    const data = (await api.createProject(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function updateProject(values: {
  id: number;
  name: string;
  location: number[];
  clientId: number;
  isOutstation: boolean;
  description: string;
  address: string;
}) {
  try {
    const data = (await api.updateProject(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function updateProjectTeam(values: { id: number; members: number[] }) {
  try {
    const data = (await api.updateProjectTeam(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function getProjectDetailsById(values: { id: number }) {
  try {
    const data = (await api.getProjectDetailsById(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function getTeamMembers(values: { projectId: number }, page: number, pageSize: number) {
  try {
    const data = (await api.getTeamMembers(values, page, pageSize)).data;
    // console.log("data", data);

    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function getPendingAttendaceList(
  values: {
    userID: number | undefined;
    divisionId: number | undefined;
    joinProjectAssignment: boolean | undefined;
    createdFrom: string | undefined;
    createdTo: string | undefined;
    endFrom?: string;
    endTo?: string;
  },
  page: number,
  pageSize: number
) {
  // console.log("values", values);

  try {
    const data = (await api.getPendingAttendaceList(values, page, pageSize)).data;
    // console.log("data", data);

    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function startProject(id: number) {
  try {
    const data = (await api.startProject(id)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function endProject(id: number) {
  try {
    const data = (await api.endProject(id)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}
