import * as api from "../api/index";

export const StaffService = {
  getEmployeeDesignationList,
  getEmployeeList,
  createEmployee,
  updateEmployee,
  getDivisionList,
  getMe,
  getEmployee,
};

async function getEmployeeDesignationList() {
  try {
    const data = (await api.getEmployeeDesignationList()).data;
    return { isSuccess: true as const, data, error: undefined };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function getEmployeeList(
  values: {
    activeState: "ACTIVE" | "INACTIVE" | undefined;
    designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | undefined;
    searchTerm: string | undefined;
    divisionId: number | undefined;
    joinDivision: boolean;
  },
  page: number,
  pageSize: number
) {
  try {
    const data = (await api.getEmployeeList(values, page, pageSize)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error: error };
  }
}

async function updateEmployee(values: {
  id: number;
  mobile: string;
  profilePicturePath: string | null;
  roleId: number;
  divisionId: number;
  designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
  activeState: "ACTIVE" | "INACTIVE";
  name: string;
  nameInitials: string;
  nic: string;
  email: string;
  address: string;
  birthDate: string;
  joinDate: string;
  salaryBasic: number;
  salaryBudgeted: number;
  salaryWage: number;
  salaryAllowance: number;
  salaryVehicleAllowance: number;
  salaryTravelAllowance: number;
  salaryOtPerHour: number;
  salaryBata: number;
  salarayOutstationPerDay: number;
  class: string;
  entitledLeaveDaysAnnual: number;
  entitledLeaveDaysCasual: number;
  entitledLeaveDaysMedical: number;
  percentageEpf8: number;
  percentageEpf12: number;
  percentageEtf: number;
}) {
  try {
    const data = (await api.updateEmployee(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}

async function createEmployee(values: {
  mobile: string;
  empNo: string;
  roleId: number;
  divisionId: number;
  designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
  activeState: "ACTIVE" | "INACTIVE";
  name: string;
  nameInitials: string;
  nic: string;
  email: string;
  address: string;
  birthDate: string;
  joinDate: string;
  salaryBasic: number;
  salaryBudgeted: number;
  salaryWage: number;
  salaryAllowance: number;
  salaryVehicleAllowance: number;
  salaryTravelAllowance: number;
  salaryOtPerHour: number;
  salaryBata: number;
  salarayOutstationPerDay: number;
  password: string;
  class: string;
  entitledLeaveDaysAnnual: number;
  entitledLeaveDaysCasual: number;
  entitledLeaveDaysMedical: number;
  percentageEpf8: number;
  percentageEpf12: number;
  percentageEtf: number;
}) {
  try {
    const data = (await api.createEmployee(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}

async function getDivisionList(
  values: {
    headEmpId: number | undefined;
    searchTerm: string | undefined;
  },
  page: number,
  pageSize: number
) {
  try {
    const data = (await api.getDivisionList(values, page, pageSize)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}

async function getEmployee(id: number) {
  try {
    const data = (await api.getEmployee(id)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}
async function getMe(values: {
  joinAttendanceRecords: boolean | undefined;
  joinLeaveRequests: boolean | undefined;
  joinUploads: boolean | undefined;
  page: number | undefined;
  pageSize: number | undefined;
}) {
  try {
    const data = (await api.getMe(values)).data;
    return { isSuccess: true as const, data };
  } catch (error) {
    return { isSuccess: false as const, error };
  }
}
