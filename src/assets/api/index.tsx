import api from "./interceptor";
import axios from "axios";

export function signIn(input: { username: string; password: string }) {
  return api.post("/sessions/@password", {
    email: input.username,
    password: input.password,
  });
}
export function listJobPost(input: {
  page: number;
  pageSize: number;
  name?: string;
  location?: string;
  type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  workMode?: "ON_SITE" | "REMOTE" | "HYBRID";
  positionId?: number;
  processingStatus?: "PENDING" | "OPEN" | "CLOSED" | "ARCHIVED";
  createdFrom?: string;
  createdTo?: string;
}) {
  return api.get("/jobPostings", {
    params: input,
  });
}

// export const downloadFile = (url: string) => {
//   return axios.get(url, {
//     responseType: "blob",
//   });
// };

// endpoint manu list :-

// 1. staff service
// 2. project service
// 3. project employee assignments
// 4. attendance records
// 5. counters records
// 6. leave management statet
// 7. upload service

// -------------------# 01 staff services endpoints start here #-------------------------

export const getEmployeeDesignationList = () => {
  return api.get("/constants/employeeDesignation");
};

export const getEmployeeList = (
  values: {
    activeState: "ACTIVE" | "INACTIVE" | undefined;
    designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | undefined;
    searchTerm: string | undefined;
    divisionId: number | undefined;
    joinDivision: boolean;
  },
  page: number,
  pageSize: number
) => {
  return api.get("/users", {
    query: {
      activeState: values.activeState,
      designation: values.designation,
      divisionId: values.divisionId,
      page: page,
      pageSize: pageSize,
      searchTerm: values.searchTerm,
      joinDivision: values.joinDivision,
    },
  });
};

export const updateEmployee = (values: {
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
}) => {
  return api.put("/users/:id", {
    path: {
      id: values.id,
    },
    body: {
      data: {
        mobile: values.mobile,
        roleId: values.roleId,
        divisionId: values.divisionId,
        designation: values.designation,
        activeState: values.activeState,
        name: values.name,
        nameInitials: values.nameInitials,
        nic: values.nic,
        address: values.address,
        birthDate: values.birthDate,
        salaryBasic: values.salaryBasic,
        salaryBudgeted: values.salaryBudgeted,
        salaryWages: values.salaryWage,
        salaryAllowance: values.salaryAllowance,
        salaryVehicleAllowance: values.salaryVehicleAllowance,
        salaryTravelAllowance: values.salaryTravelAllowance,
        salaryOtPerHour: values.salaryOtPerHour,
        salaryBata: values.salaryBata,
        salaryOutstationPerDay: values.salarayOutstationPerDay,
        entitledLeaveDaysAnnual: values.entitledLeaveDaysAnnual,
        entitledLeaveDaysCasual: values.entitledLeaveDaysCasual,
        entitledLeaveDaysMedical: values.entitledLeaveDaysMedical,
        createdAt: values.joinDate,
        resignedAt: null,
        email: values.email,
        class: values.class,
        percentageEpf12: values.percentageEpf12,
        percentageEpf8: values.percentageEpf8,
        percentageEtf: values.percentageEtf,
      },
    },
  });
};

export const createEmployee = (values: {
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
}) => {
  return api.post("/users", {
    body: {
      data: {
        mobile: values.mobile,
        roleId: values.roleId,
        divisionId: values.divisionId,
        designation: values.designation,
        activeState: values.activeState,
        name: values.name,
        nameInitials: values.nameInitials,
        nic: values.nic,
        address: values.address,
        birthDate: values.birthDate,
        salaryBasic: values.salaryBasic,
        salaryBudgeted: values.salaryBudgeted,
        salaryWages: values.salaryWage,
        salaryAllowance: values.salaryAllowance,
        salaryVehicleAllowance: values.salaryVehicleAllowance,
        salaryTravelAllowance: values.salaryTravelAllowance,
        salaryOtPerHour: values.salaryOtPerHour,
        salaryBata: values.salaryBata,
        salaryOutstationPerDay: values.salarayOutstationPerDay,
        password: values.password,
        entitledLeaveDaysAnnual: values.entitledLeaveDaysAnnual,
        entitledLeaveDaysCasual: values.entitledLeaveDaysCasual,
        entitledLeaveDaysMedical: values.entitledLeaveDaysMedical,
        createdAt: values.joinDate,
        resignedAt: null,
        email: values.email,
        employeeNumber: values.empNo,
        class: values.class,
        percentageEpf12: values.percentageEpf12,
        percentageEpf8: values.percentageEpf8,
        percentageEtf: values.percentageEtf,
      },
    },
  });
};

export const getDivisionList = (
  values?: {
    searchTerm?: string;
  },
  page?: number,
  pageSize?: number
) => {
  return api.get("/divisions", {
    query: {
      page: page,
      pageSize: pageSize,
      searchTerm: values?.searchTerm,
    },
  });
};

export const getMe = (values?: {
  joinAttendanceRecords?: boolean;
  joinLeaveRequests?: boolean;
  joinUploads?: boolean;
  page?: number;
  pageSize?: number;
}) => {
  return api.get("/users/@me", {
    query: {
      joinAttendanceRecords: values?.joinAttendanceRecords,
      joinLeaveRequests: values?.joinLeaveRequests,
      joinUploads: values?.joinUploads,
      page: values?.page,
      pageSize: values?.pageSize,
    },
  });
};

export const replaceMyPassword = (values: { oldPassword: string; newPassword: string }) => {
  return api.put("/users/@me/password", {
    body: {
      data: {
        newPassword: values.newPassword,
        oldPassword: values.oldPassword,
      },
    },
  });
};

export const getEmployee = (id: number) => {
  return api.get("/users/:id", {
    path: {
      id: id,
    },
  });
};

export const replaceEmployeePassword = (input: { id: number; password: string }) => {
  return api.put("/users/:id/password", {
    path: {
      id: input.id,
    },
    body: {
      data: {
        password: input.password,
      },
    },
  });
};

export const resignEmployee = (input: { id: number }) => {
  return api.post("/users/:id/_resign", {
    path: {
      id: input.id,
    },
  });
};

export const downloadUserList = (input: {
  activeState?: "ACTIVE" | "INACTIVE";
  designation?: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
  divisionId?: number;
  roleId?: number;
  searchTerm?: string;
  pendingLeaveRequests?: boolean;
  columns2Include: string[];
}) => {
  return api.post("/users/_download", {
    query: {
      activeState: input.activeState,
      designation: input.designation,
      divisionId: input.divisionId,
      roleId: input.roleId,
      searchTerm: input.searchTerm,
      pendingLeaveRequests: input.pendingLeaveRequests,
    },
    body: {
      data: {
        columns2Include: input.columns2Include,
      },
    },
    responseType: "blob",
  });
};

// -------------------# 02 project services endpoints start here #-------------------------

export const getClientList = (
  values: {
    activeState: "ACTIVE" | "INACTIVE" | undefined;
    searchTerm: string | undefined;
  },
  page: number,
  pageSize: number
) => {
  return api.get("/projectClients", {
    query: {
      page: page,
      pageSize: pageSize,
      searchTerm: values.searchTerm,
      activeState: values.activeState,
    },
  });
};

export const createNewClient = (values: {
  company_name: string;
  company_contact: string | null;
  company_address: string | null;
  company_email: string | null;
  person_name: string | null;
  person_contact: string | null;
  status: "ACTIVE" | "INACTIVE";
  discription: string | null;
}) => {
  return api.post("/projectClients", {
    body: {
      data: {
        businessName: values.company_name,
        businessPhone: values.company_contact,
        businessEmail: values.company_email,
        businessAddress: values.company_address,
        personName: values.person_name,
        personPhone: values.person_contact,
        description: values.discription,
        activeState: values.status,
      },
    },
  });
};

export const updateClientDetails = (values: {
  id: number;
  company_name: string;
  company_contact: string | null;
  company_address: string | null;
  company_email: string | null;
  person_name: string | null;
  person_contact: string | null;
  status: "ACTIVE" | "INACTIVE";
  discription: string | null;
}) => {
  return api.put("/projectClients/:id", {
    path: {
      id: values.id,
    },
    body: {
      data: {
        businessName: values.company_name,
        businessPhone: values.company_contact,
        businessEmail: values.company_email,
        businessAddress: values.company_address,
        personName: values.person_name,
        personPhone: values.person_contact,
        description: values.discription,
        activeState: values.status,
      },
    },
  });
};

export const getClientDetailsBy = (values: { id: number }) => {
  return api.get("/projectClients/:id", {
    path: {
      id: values.id,
    },
  });
};

// -------------------# 03 project employee assignments start here #-------------------------

export const getProjectEmployeeAssignments = (input: {
  pageSize?: number;
  page?: number;
  userId?: number;
  projectProcessingState?: "PENDING" | "ONGOING" | "COMPLETED";
  divisionId?: number;
  projectId?: number;
}) => {
  return api.get("/projectEmployeeAssignments", {
    query: {
      pageSize: input.pageSize,
      page: input.page,
      userId: input.userId,
      projectProcessingState: input.projectProcessingState,
      divisionId: input.divisionId,
      projectId: input.projectId,
    },
  });
};

export const getProjectList = (
  values: {
    clientId?: number;
    divisionId?: number;
    state?: "PENDING" | "ONGOING" | "COMPLETED";
    searchTerm?: string;
    isOutstation?: boolean;
  },
  page: number,
  pageSize: number
) => {
  return api.get("/projects", {
    query: {
      clientId: values.clientId,
      divisionId: values.divisionId,
      searchTerm: values.searchTerm,
      processingState: values.state,
      page: page,
      pageSize: pageSize,
      joinClient: true,
      joinDivision: true,
      isOutstation: values.isOutstation,
    },
  });
};

export const createProject = (values: {
  name: string;
  location: number[];
  divisionId: number;
  clientId: number;
  isOutstation: boolean;
  description: string;
  address: string;
}) => {
  return api.post("/projects", {
    body: {
      data: {
        clientId: values.clientId,
        description: values.description,
        divisionId: values.divisionId,
        isOutstation: values.isOutstation,
        location: values.location,
        name: values.name,
        address: values.address,
      },
    },
  });
};

export const updateProject = (values: {
  id: number;
  name: string;
  location: number[];
  clientId: number;
  isOutstation: boolean;
  description: string;
  address: string;
}) => {
  return api.put("/projects/:id", {
    path: {
      id: values.id,
    },
    body: {
      data: {
        clientId: values.clientId,
        description: values.description,
        location: values.location,
        name: values.name,
        address: values.address,
      },
    },
  });
};

export const updateProjectTeam = (values: { id: number; members: number[] }) => {
  return api.put("/projects/:id/employees", {
    path: {
      id: values.id,
    },
    body: {
      data: {
        userIds: values.members,
      },
    },
  });
};

export const getProjectDetailsById = (values: { id: number }) => {
  return api.get("/projects/:id", {
    path: {
      id: values.id,
    },
  });
};

export const getTeamMembers = (values: { projectId: number }, page: number, pageSize: number) => {
  return api.get("/projectEmployeeAssignments", {
    query: {
      page: page,
      pageSize: pageSize,
      projectId: values.projectId,
    },
  });
};

export const endProject = (id: number) => {
  return api.post("/projects/:id/_end", {
    path: {
      id: id,
    },
  });
};

export const startProject = (id: number) => {
  return api.post("/projects/:id/_start", {
    path: {
      id: id,
    },
  });
};

// -------------------# 04 attendance records start here #-------------------------

export const listAttendanceRecords = (input: {
  pageSize?: number;
  page?: number;
  userId?: number | "@me";
  projectId?: number;
  divisionId?: number;
  createdFrom?: string;
  searchTerm?: string;
  createdTo?: string;
  joinUser?: boolean;
  joinProjectAssignment?: boolean;
}) => {
  return api.get("/attendanceRecords", {
    query: {
      joinUser: input.joinUser,
      joinProjectAssignment: input.joinProjectAssignment,
      pageSize: input.pageSize,
      page: input.page,
      userId: input.userId,
      projectAssignmentId: input.projectId,
      divisionId: input.divisionId,
      createdFrom: input.createdFrom,
      createdTo: input.createdTo,
      searchTerm: input.searchTerm,
    },
  });
};

export const downloadAttendanceRecords = (input: {
  userId?: number;
  projectId?: number;
  divisionId?: number;
  createdFrom?: string;
  createdTo?: string;
  searchTerm?: string;
}) => {
  return api.get("/attendanceRecords/_download", {
    query: {
      userId: input.userId,
      projectAssignmentId: input.projectId,
      divisionId: input.divisionId,
      createdFrom: input.createdFrom,
      createdTo: input.createdTo,
      searchTerm: input.searchTerm,
    },
    responseType: "blob",
  });
};

export const listClockRecords = (input: {
  pageSize?: number;
  page?: number;
  userId?: number | "@me";
  projectId?: number;
  divisionId?: number;
  createdFrom?: string;
  createdTo?: string;
  joinUser?: boolean;
  hasOtHrs?: boolean;
  joinProjectAssignment?: boolean;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}) => {
  return api.get("/clockRecords", {
    query: {
      pageSize: input.pageSize,
      page: input.page,
      userId: input.userId,
      divisionId: input.divisionId,
      createdFrom: input.createdFrom,
      createdTo: input.createdTo,
      joinUser: input.joinUser,
      hasOtHrs: input.hasOtHrs,
      joinAttendanceRecords: input.joinProjectAssignment,
      approvalState: input.approvalStatus,
    },
  });
};

export const createAttandaceRecord = (input: {
  divisionId: number;
  userId: number;
  projectAssignmentId: number | null;
  type: "WORK";
  createdLocation: number[];
  createdAt: string;
  comment: string | null;
  endedAt: string;
  endedLocation: number[];
}) => {
  return api.post("/attendanceRecords", {
    body: {
      data: input,
    },
  });
};

export const replaceAttandaceRecord = (input: {
  id: number;
  divisionId: number;
  userId: number;
  projectAssignmentId: number | null;
  type: "WORK";
  createdLocation: number[];
  createdAt: string;
  comment: string | null;
  endedAt: string;
  endedLocation: number[];
}) => {
  return api.put("/attendanceRecords/:id", {
    path: {
      id: input.id,
    },
    body: {
      data: input,
    },
  });
};

export const clockIn = ({ projectId, createdLocation }: { projectId: number | null; createdLocation: [lat: number, long: number] }) => {
  return api.post("/users/@me/_clockIn", {
    body: {
      data: {
        projectAssignmentId: projectId,
        type: "WORK",
        createdLocation: createdLocation,
      },
    },
  });
};

export const approveClockRecord = (id: number) => {
  return api.post("/clockRecords/_approve", {
    body: {
      data: [
        {
          id: id,
          comment: null,
        },
      ],
    },
  });
};

export const clockOut = ({ endedLocation, comment }: { endedLocation: [lat: number, long: number]; comment: string | null }) => {
  return api.post("/users/@me/_clockOut", {
    body: {
      data: {
        endedLocation: endedLocation,
        comment: comment,
      },
    },
  });
};

// -------------------# 05 counters records start here #-------------------------

export const countUsersByAttendance = (props: {
  date: string;
  calculateCounts?: boolean;
  fetchClockedInNotClockedOutUsers?: boolean;
  fetchClockedInAndClockedOutUsers?: boolean;
  fetchLateUsers?: boolean;
  fetchOnLeaveUsers?: boolean;
  page?: number;
  pageSize?: number;
}) => {
  return api.get("/summaries/users/all/byAttendance", {
    query: {
      day: props.date,
      calculateCounts: props.calculateCounts,
      fetchClockedInNotClockedOutUsers: props.fetchClockedInNotClockedOutUsers,
      fetchClockedInAndClockedOutUsers: props.fetchClockedInAndClockedOutUsers,
      fetchLateUsers: props.fetchLateUsers,
      fetchOnLeaveUsers: props.fetchOnLeaveUsers,
      page: props.page,
      pageSize: props.pageSize,
    },
  });
};

export const getPendingAttendaceList = (
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
) => {
  return api.get("/attendanceRecords", {
    query: {
      page: page,
      pageSize: pageSize,
      userId: values.userID,
      divisionId: values.divisionId,
      joinProjectAssignment: values.joinProjectAssignment,
      createdFrom: values.createdFrom,
      createdTo: values.createdTo,
      joinUser: true,
      endedFrom: values.endFrom,
      endedTo: values.endTo,
    },
  });
};

export const getPrjectsByClockLocation = (page: number, pageSize: number) => {
  return api.get("/summaries/projects/byClockInLocation", {
    query: {
      page: page,
      pageSize: pageSize,
    },
  });
};

export const getClockLeaveSummaries = (page: number, pageSize: number, divisionId: number | undefined, year: number, month: number) => {
  return api.get("/summaries/users/workBehaviorRecords", {
    query: {
      page: page,
      pageSize: pageSize,
      divisionId,
      year,
      month,
    },
  });
};

export const downloadWorkBehaviorRecords = (input: { divisionId?: number | undefined; year: number; month: number }) => {
  return api.get("/summaries/users/workBehaviorRecords/_download", {
    query: {
      divisionId: input.divisionId,
      year: input.year,
      month: input.month,
    },
    responseType: "blob",
  });
};

export const listProjectContributionRecords = (input: { projectId: number; fromDay: string; toDay: string }) => {
  return api.get("/summaries/projects/projectContributionRecords", {
    query: {
      projectId: input.projectId,
      fromDay: input.fromDay,
      toDay: input.toDay,
    },
  });
};

export const downloadProjectContributionRecords = (input: { projectId: number; fromDay: string; toDay: string }) => {
  return api.get("/summaries/projects/projectContributionRecords/_download", {
    query: {
      projectId: input.projectId,
      fromDay: input.fromDay,
      toDay: input.toDay,
    },
    responseType: "blob",
  });
};
// -----------------# 06 leave management statet here #-------------------------

export const getLeaveRequestTypes = () => {
  return api.get("/constants/leaveRequestTypes");
};

export const listLeaveRequests = (input: {
  day?: number;
  division?: number;
  emp1ApprovalState?: "PENDING" | "APPROVED" | "REJECTED";
  emp2ApprovalState?: "PENDING" | "APPROVED" | "REJECTED";
  month?: number;
  type?: "ANNUAL" | "MEDICAL" | "CASUAL";
  year?: number;
  userId?: number | "@me";
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  startDate?: string;
  toDate?: string;
  joinUser?: boolean;
}) => {
  return api.get("/leaveRequests", {
    query: {
      day: input.day,
      divisionId: input.division,
      emp1ApprovalState: input.emp1ApprovalState,
      emp2ApprovalState: input.emp2ApprovalState,
      month: input.month,
      page: input.page,
      pageSize: input.pageSize,
      searchTerm: input.searchTerm,
      type: input.type,
      year: input.year,
      userId: input.userId,
      joinUser: input.joinUser,
      startsFrom: input.startDate,
      startsTo: input.toDate,
    },
  });
};

export const createLeave = (
  input: {
    userId: number | "@me";
    type: "ANNUAL" | "MEDICAL" | "CASUAL" | "DAY_OFF";
    period: "ONE_DAY" | "HALF_DAY_MORNING" | "HALF_DAY_AFTERNOON";
    year: number;
    month: number;
    day: number;
    comment: string | null;
    description: string | null;
  }[]
) => {
  return api.post("/leaveRequests", {
    body: {
      data: input,
    },
  });
};

export const getLeaveRequest = (id: number) => {
  return api.get("/leaveRequests/:id", {
    path: {
      id: id,
    },
  });
};

export const deleteLeaveByEmployee = (id: number) => {
  return api.delete("/leaveRequests/:id", {
    path: {
      id: id,
    },
  });
};

export const approveLeave = (
  input: {
    id: number;
    approvalState: "APPROVED" | "REJECTED";
    comment: string | null;
  }[]
) => {
  return api.put("/leaveRequests/_review", {
    body: {
      data: input,
    },
  });
};

// # 07 upload services start here -----------------------------

export const createUpload = async (
  file: File,
  userId: number,
  category: "PHOTO" | "CV" | "LETTER" | "OTHER",
  name: string,
  onUploadProgress: (percentCompleted: number) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.axios.post("/uploads", formData, {
    params: {
      userId: userId,
      category: category,
      name: name,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0);
      onUploadProgress(percentCompleted);
    },
  });
};

export const replaceProfilePicture = async (file: File, userId: number) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.put("/users/:id/profilePicture", {
    path: {
      id: userId,
    },
    body: formData as any,
    header: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });
};

export const replaceMyProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.put("/users/@me/profilePicture", {
    body: formData as any,
    header: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });
};

export const listUploads = ({ userId, category }: { userId?: number | "@me"; category?: "PHOTO" | "CV" | "LETTER" | "OTHER" }) => {
  return api.get("/uploads", {
    query: {
      userId: userId,
      category: category,
    },
  });
};

export const deleteUpload = (id: number) => {
  return api.delete("/uploads/:id", {
    path: {
      id: id,
    },
  });
};

export const fetchUpload = async (path: string) => {
  return await api.get("/uploads/:staticPath", {
    path: {
      staticPath: path,
    },
    responseType: "blob",
  });
};

// # 08 division services start here -----------------------------

export const listDivision = (input: { page?: number; pageSize?: number; searchTerm?: string }) => {
  return api.get("/divisions", {
    query: {
      page: input.page,
      pageSize: input.pageSize,
      searchTerm: input.searchTerm,
    },
  });
};

export const createDivision = (input: { name: string }) => {
  return api.post("/divisions", {
    body: {
      data: {
        name: input.name,
      },
    },
  });
};

export const updatDivision = (input: { name: string; id: number }) => {
  return api.put("/divisions/:id", {
    path: {
      id: input.id,
    },
    body: {
      data: {
        name: input.name,
      },
    },
  });
};

// # 09 Salary Records start here --------------------------------

export const listSalaryRecords = (input: {
  divisionId?: number;
  month?: number;
  year?: number;
  page?: number;
  pageSize?: number;
  userId?: number | "@me";
  joinUser?: boolean;
  searchTerm?: string;
}) => {
  return api.get("/salaryRecords", {
    query: {
      divisionId: input.divisionId,
      month: input.month,
      year: input.year,
      page: input.page,
      pageSize: input.pageSize,
      userId: input.userId,
      searchTerm: input.searchTerm,
      joinUser: input.joinUser,
    },
  });
};

export const updateSalaryRecords = (
  input: {
    id: number;
    salaryBasic?: number;
    salaryBudgeted?: number;
    salaryWages?: number;
    salaryAllowance?: number;
    salaryVehicleAllowance?: number;
    salaryTravelAllowance?: number;
    salaryBata?: number;
    salaryOutstation?: number;
    salaryOt?: number;
    deductionEpf8?: number;
    deductionEpf12?: number;
    deductionEtf?: number;
    deductionNoPay?: number;
    deductionLoan?: number;
    deductionAdvance?: number;
    deductionPayee?: number;
    deductionOther?: number;
    comment?: string;
  }[]
) => {
  return api.put("/salaryRecords", {
    body: {
      data: input,
    },
  });
};

export const updateSalaryRecord = (input: {
  id: number;
  salaryBasic: number;
  salaryBudgeted: number;
  salaryWages: number;
  salaryAllowance: number;
  salaryVehicleAllowance: number;
  salaryTravelAllowance: number;
  salaryBata: number;
  salaryOutstation: number;
  salaryOt: number;
  salaryTotal: number;
  deductionEpf8: number;
  deductionEpf12: number;
  deductionEtf: number;
  deductionNoPay: number;
  deductionLoan: number;
  deductionAdvance: number;
  deductionPayee: number;
  deductionOther: number;
  comment: string;
}) => {
  return api.put("/salaryRecords/:id", {
    path: {
      id: input.id,
    },
    body: {
      data: {
        salaryBasic: input.salaryBasic,
        salaryBudgeted: input.salaryBudgeted,
        salaryWages: input.salaryWages,
        salaryAllowance: input.salaryAllowance,
        salaryVehicleAllowance: input.salaryVehicleAllowance,
        salaryTravelAllowance: input.salaryTravelAllowance,
        salaryBata: input.salaryBata,
        salaryOutstation: input.salaryOutstation,
        salaryOt: input.salaryOt,
        deductionEpf8: input.deductionEpf8,
        deductionEpf12: input.deductionEpf12,
        deductionEtf: input.deductionEtf,
        deductionNoPay: input.deductionNoPay,
        deductionLoan: input.deductionLoan,
        deductionAdvance: input.deductionAdvance,
        deductionPayee: input.deductionPayee,
        deductionOther: input.deductionOther,
        comment: input.comment,
      },
    },
  });
};

export const downloadSalaryRecords = (input: { divisionId?: number; year: number; month: number; userId?: number; searchTerm?: string }) => {
  return api.get("/salaryRecords/_download", {
    query: {
      divisionId: input.divisionId,
      year: input.year,
      month: input.month,
      searchTerm: input.searchTerm,
      userId: input.userId,
    },
    responseType: "blob",
  });
};

export const listCalendarEvents = (input: { day?: number; month?: number; year: number; page?: number; pageSize?: number }) => {
  return api.get("/calendarEvents", {
    query: {
      year: input.year,
      day: input.day,
      month: input.month,
      page: input.page,
      pageSize: input.pageSize,
    },
  });
};

export const updateCalendarEvent = (input: { day: number; month: number; year: number; name: string; emoji: string }) => {
  return api.put("/calendarEvents", {
    body: {
      data: {
        day: input.day,
        emoji: input.emoji,
        month: input.month,
        name: input.name,
        year: input.year,
      },
    },
  });
};

export const deleteCalendarEvent = (input: { day: number; month: number; year: number }) => {
  return api.delete("/calendarEvents", {
    query: {
      day: input.day,
      month: input.month,
      year: input.year,
    },
  });
};
