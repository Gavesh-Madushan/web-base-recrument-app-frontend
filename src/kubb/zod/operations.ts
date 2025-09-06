import {
  createAttendanceRecordMutationRequestSchema,
  createAttendanceRecord201Schema,
  createAttendanceRecord400Schema,
  createAttendanceRecord404Schema,
  createAttendanceRecord409Schema,
  createAttendanceRecordMutationResponseSchema,
} from './Attendance Records/createAttendanceRecordSchema.ts'
import {
  downloadAttendanceRecords200Schema,
  downloadAttendanceRecords400Schema,
  downloadAttendanceRecordsQueryResponseSchema,
  downloadAttendanceRecordsQueryParamsSchema,
} from './Attendance Records/downloadAttendanceRecordsSchema.ts'
import {
  getAttendanceRecord200Schema,
  getAttendanceRecord404Schema,
  getAttendanceRecordQueryResponseSchema,
  getAttendanceRecordPathParamsSchema,
} from './Attendance Records/getAttendanceRecordSchema.ts'
import {
  listAttendanceRecords200Schema,
  listAttendanceRecordsQueryResponseSchema,
  listAttendanceRecordsQueryParamsSchema,
} from './Attendance Records/listAttendanceRecordsSchema.ts'
import {
  replaceAttendanceRecordMutationRequestSchema,
  replaceAttendanceRecord201Schema,
  replaceAttendanceRecord400Schema,
  replaceAttendanceRecord404Schema,
  replaceAttendanceRecord409Schema,
  replaceAttendanceRecordMutationResponseSchema,
  replaceAttendanceRecordPathParamsSchema,
} from './Attendance Records/replaceAttendanceRecordSchema.ts'
import {
  deleteCalendarEvent204Schema,
  deleteCalendarEvent400Schema,
  deleteCalendarEvent404Schema,
  deleteCalendarEventMutationResponseSchema,
  deleteCalendarEventQueryParamsSchema,
} from './Calendar Events/deleteCalendarEventSchema.ts'
import {
  listCalendarEvents200Schema,
  listCalendarEventsQueryResponseSchema,
  listCalendarEventsQueryParamsSchema,
} from './Calendar Events/listCalendarEventsSchema.ts'
import {
  upsertCalendarEventMutationRequestSchema,
  upsertCalendarEvent200Schema,
  upsertCalendarEventMutationResponseSchema,
} from './Calendar Events/upsertCalendarEventSchema.ts'
import {
  approveClockRecordsMutationRequestSchema,
  approveClockRecords204Schema,
  approveClockRecords400Schema,
  approveClockRecords404Schema,
  approveClockRecordsMutationResponseSchema,
} from './Clock Records/approveClockRecordsSchema.ts'
import {
  getClockRecord200Schema,
  getClockRecord404Schema,
  getClockRecordQueryResponseSchema,
  getClockRecordPathParamsSchema,
} from './Clock Records/getClockRecordSchema.ts'
import { listClockRecords200Schema, listClockRecordsQueryResponseSchema, listClockRecordsQueryParamsSchema } from './Clock Records/listClockRecordsSchema.ts'
import { listEmployeeDesignations200Schema, listEmployeeDesignationsQueryResponseSchema } from './Constants/listEmployeeDesignationsSchema.ts'
import { listLeaveRequestTypes200Schema, listLeaveRequestTypesQueryResponseSchema } from './Constants/listLeaveRequestTypesSchema.ts'
import { listModules200Schema, listModulesQueryResponseSchema } from './Constants/listModulesSchema.ts'
import { listUploadCategories200Schema, listUploadCategoriesQueryResponseSchema } from './Constants/listUploadCategoriesSchema.ts'
import {
  downloadProjectContributionRecords200Schema,
  downloadProjectContributionRecords400Schema,
  downloadProjectContributionRecords404Schema,
  downloadProjectContributionRecordsQueryResponseSchema,
  downloadProjectContributionRecordsQueryParamsSchema,
} from './Counters & Summaries/downloadProjectContributionRecordsSchema.ts'
import {
  downloadWorkBehaviorRecords200Schema,
  downloadWorkBehaviorRecords400Schema,
  downloadWorkBehaviorRecordsQueryResponseSchema,
  downloadWorkBehaviorRecordsQueryParamsSchema,
} from './Counters & Summaries/downloadWorkBehaviorRecordsSchema.ts'
import {
  downloadWorkProjectRecords200Schema,
  downloadWorkProjectRecords400Schema,
  downloadWorkProjectRecordsQueryResponseSchema,
  downloadWorkProjectRecordsQueryParamsSchema,
} from './Counters & Summaries/downloadWorkProjectRecordsSchema.ts'
import {
  listProjectContributionRecords200Schema,
  listProjectContributionRecords400Schema,
  listProjectContributionRecordsQueryResponseSchema,
  listProjectContributionRecordsQueryParamsSchema,
} from './Counters & Summaries/listProjectContributionRecordsSchema.ts'
import {
  listProjectWorkTimeRecords200Schema,
  listProjectWorkTimeRecordsQueryResponseSchema,
  listProjectWorkTimeRecordsQueryParamsSchema,
} from './Counters & Summaries/listProjectWorkTimeRecordsSchema.ts'
import {
  listWorkBehaviorRecords200Schema,
  listWorkBehaviorRecordsQueryResponseSchema,
  listWorkBehaviorRecordsQueryParamsSchema,
} from './Counters & Summaries/listWorkBehaviorRecordsSchema.ts'
import {
  summarizeAllUsersByAttendance200Schema,
  summarizeAllUsersByAttendanceQueryResponseSchema,
  summarizeAllUsersByAttendanceQueryParamsSchema,
} from './Counters & Summaries/summarizeAllUsersByAttendanceSchema.ts'
import {
  summarizeEmployeeUsersByAttendance200Schema,
  summarizeEmployeeUsersByAttendanceQueryResponseSchema,
  summarizeEmployeeUsersByAttendanceQueryParamsSchema,
} from './Counters & Summaries/summarizeEmployeeUsersByAttendanceSchema.ts'
import {
  summarizeProjectsByClockInLocation200Schema,
  summarizeProjectsByClockInLocationQueryResponseSchema,
  summarizeProjectsByClockInLocationQueryParamsSchema,
} from './Counters & Summaries/summarizeProjectsByClockInLocationSchema.ts'
import {
  createSalaryRecordsMutationRequestSchema,
  createSalaryRecords204Schema,
  createSalaryRecordsMutationResponseSchema,
} from './Debuggers/createSalaryRecordsSchema.ts'
import {
  recalculateProjectContributionRecordsMutationRequestSchema,
  recalculateProjectContributionRecords204Schema,
  recalculateProjectContributionRecordsMutationResponseSchema,
} from './Debuggers/recalculateProjectContributionRecordsSchema.ts'
import {
  resetRemainingLeavesMutationRequestSchema,
  resetRemainingLeaves204Schema,
  resetRemainingLeavesMutationResponseSchema,
} from './Debuggers/resetRemainingLeavesSchema.ts'
import {
  upsertOngoingProjectWorkTimeRecordsMutationRequestSchema,
  upsertOngoingProjectWorkTimeRecords204Schema,
  upsertOngoingProjectWorkTimeRecordsMutationResponseSchema,
} from './Debuggers/upsertOngoingProjectWorkTimeRecordsSchema.ts'
import {
  upsertWorkBehaviorRecords4SalaryMutationRequestSchema,
  upsertWorkBehaviorRecords4Salary204Schema,
  upsertWorkBehaviorRecords4SalaryMutationResponseSchema,
} from './Debuggers/upsertWorkBehaviorRecords4SalarySchema.ts'
import {
  upsertWorkBehaviorRecordsMutationRequestSchema,
  upsertWorkBehaviorRecords204Schema,
  upsertWorkBehaviorRecordsMutationResponseSchema,
} from './Debuggers/upsertWorkBehaviorRecordsSchema.ts'
import { createDivisionMutationRequestSchema, createDivision201Schema, createDivisionMutationResponseSchema } from './Divisions/createDivisionSchema.ts'
import { getDivision200Schema, getDivision404Schema, getDivisionQueryResponseSchema, getDivisionPathParamsSchema } from './Divisions/getDivisionSchema.ts'
import { listDivisions200Schema, listDivisionsQueryResponseSchema, listDivisionsQueryParamsSchema } from './Divisions/listDivisionsSchema.ts'
import {
  replaceDivisionMutationRequestSchema,
  replaceDivision200Schema,
  replaceDivision404Schema,
  replaceDivisionMutationResponseSchema,
  replaceDivisionPathParamsSchema,
} from './Divisions/replaceDivisionSchema.ts'
import {
  createLeaveRequestsMutationRequestSchema,
  createLeaveRequests201Schema,
  createLeaveRequests400Schema,
  createLeaveRequests404Schema,
  createLeaveRequests409Schema,
  createLeaveRequestsMutationResponseSchema,
} from './Leave Requests/createLeaveRequestsSchema.ts'
import {
  deleteLeaveRequest204Schema,
  deleteLeaveRequest400Schema,
  deleteLeaveRequest404Schema,
  deleteLeaveRequestMutationResponseSchema,
  deleteLeaveRequestPathParamsSchema,
} from './Leave Requests/deleteLeaveRequestSchema.ts'
import {
  getLeaveRequest200Schema,
  getLeaveRequest404Schema,
  getLeaveRequestQueryResponseSchema,
  getLeaveRequestPathParamsSchema,
} from './Leave Requests/getLeaveRequestSchema.ts'
import {
  listLeaveRequests200Schema,
  listLeaveRequestsQueryResponseSchema,
  listLeaveRequestsQueryParamsSchema,
} from './Leave Requests/listLeaveRequestsSchema.ts'
import {
  reviewLeaveRequestsMutationRequestSchema,
  reviewLeaveRequests204Schema,
  reviewLeaveRequests400Schema,
  reviewLeaveRequests404Schema,
  reviewLeaveRequests409Schema,
  reviewLeaveRequestsMutationResponseSchema,
} from './Leave Requests/reviewLeaveRequestsSchema.ts'
import {
  createProjectClientMutationRequestSchema,
  createProjectClient201Schema,
  createProjectClientMutationResponseSchema,
} from './Project Clients/createProjectClientSchema.ts'
import {
  getProjectClient200Schema,
  getProjectClient404Schema,
  getProjectClientQueryResponseSchema,
  getProjectClientPathParamsSchema,
} from './Project Clients/getProjectClientSchema.ts'
import {
  listProjectClients200Schema,
  listProjectClientsQueryResponseSchema,
  listProjectClientsQueryParamsSchema,
} from './Project Clients/listProjectClientsSchema.ts'
import {
  replaceProjectClientMutationRequestSchema,
  replaceProjectClient200Schema,
  replaceProjectClient404Schema,
  replaceProjectClientMutationResponseSchema,
  replaceProjectClientPathParamsSchema,
} from './Project Clients/replaceProjectClientSchema.ts'
import {
  getProjectEmployeeAssignments200Schema,
  getProjectEmployeeAssignmentsQueryResponseSchema,
  getProjectEmployeeAssignmentsQueryParamsSchema,
} from './Project-Employee Assignments/getProjectEmployeeAssignmentsSchema.ts'
import {
  replaceEmployeeAssignmentsMutationRequestSchema,
  replaceEmployeeAssignments204Schema,
  replaceEmployeeAssignments400Schema,
  replaceEmployeeAssignments404Schema,
  replaceEmployeeAssignments409Schema,
  replaceEmployeeAssignmentsMutationResponseSchema,
  replaceEmployeeAssignmentsPathParamsSchema,
} from './Project-Employee Assignments/replaceEmployeeAssignmentsSchema.ts'
import { createProjectMutationRequestSchema, createProject201Schema, createProjectMutationResponseSchema } from './Projects/createProjectSchema.ts'
import {
  endProject200Schema,
  endProject403Schema,
  endProject404Schema,
  endProject409Schema,
  endProjectMutationResponseSchema,
  endProjectPathParamsSchema,
} from './Projects/endProjectSchema.ts'
import { getProject200Schema, getProject404Schema, getProjectQueryResponseSchema, getProjectPathParamsSchema } from './Projects/getProjectSchema.ts'
import { listProjects200Schema, listProjectsQueryResponseSchema, listProjectsQueryParamsSchema } from './Projects/listProjectsSchema.ts'
import {
  replaceProjectMutationRequestSchema,
  replaceProject200Schema,
  replaceProject404Schema,
  replaceProjectMutationResponseSchema,
  replaceProjectPathParamsSchema,
} from './Projects/replaceProjectSchema.ts'
import {
  startProject200Schema,
  startProject404Schema,
  startProject409Schema,
  startProjectMutationResponseSchema,
  startProjectPathParamsSchema,
} from './Projects/startProjectSchema.ts'
import { createRoleMutationRequestSchema, createRole201Schema, createRoleMutationResponseSchema } from './Roles/createRoleSchema.ts'
import { getRole200Schema, getRole404Schema, getRoleQueryResponseSchema, getRolePathParamsSchema } from './Roles/getRoleSchema.ts'
import {
  listRolePermissions200Schema,
  listRolePermissions404Schema,
  listRolePermissionsQueryResponseSchema,
  listRolePermissionsPathParamsSchema,
  listRolePermissionsQueryParamsSchema,
} from './Roles/listRolePermissionsSchema.ts'
import { listRoles200Schema, listRolesQueryResponseSchema, listRolesQueryParamsSchema } from './Roles/listRolesSchema.ts'
import {
  replaceRolePermissionsMutationRequestSchema,
  replaceRolePermissions204Schema,
  replaceRolePermissions403Schema,
  replaceRolePermissions404Schema,
  replaceRolePermissions500Schema,
  replaceRolePermissionsMutationResponseSchema,
  replaceRolePermissionsPathParamsSchema,
} from './Roles/replaceRolePermissionsSchema.ts'
import {
  replaceRoleMutationRequestSchema,
  replaceRole200Schema,
  replaceRole404Schema,
  replaceRoleMutationResponseSchema,
  replaceRolePathParamsSchema,
} from './Roles/replaceRoleSchema.ts'
import {
  downloadSalaryRecords200Schema,
  downloadSalaryRecords400Schema,
  downloadSalaryRecordsQueryResponseSchema,
  downloadSalaryRecordsQueryParamsSchema,
} from './Salary Records/downloadSalaryRecordsSchema.ts'
import {
  getSalaryRecord200Schema,
  getSalaryRecord404Schema,
  getSalaryRecordQueryResponseSchema,
  getSalaryRecordPathParamsSchema,
} from './Salary Records/getSalaryRecordSchema.ts'
import {
  listSalaryRecords200Schema,
  listSalaryRecordsQueryResponseSchema,
  listSalaryRecordsQueryParamsSchema,
} from './Salary Records/listSalaryRecordsSchema.ts'
import {
  replaceSalaryRecordMutationRequestSchema,
  replaceSalaryRecord200Schema,
  replaceSalaryRecord400Schema,
  replaceSalaryRecord404Schema,
  replaceSalaryRecordMutationResponseSchema,
  replaceSalaryRecordPathParamsSchema,
} from './Salary Records/replaceSalaryRecordSchema.ts'
import {
  updateSalaryRecordsMutationRequestSchema,
  updateSalaryRecords204Schema,
  updateSalaryRecords404Schema,
  updateSalaryRecordsMutationResponseSchema,
} from './Salary Records/updateSalaryRecordsSchema.ts'
import {
  createSessionMutationRequestSchema,
  createSession201Schema,
  createSession401Schema,
  createSession404Schema,
  createSessionMutationResponseSchema,
} from './Sessions/createSessionSchema.ts'
import {
  createUploadMutationRequestSchema,
  createUpload201Schema,
  createUpload404Schema,
  createUpload413Schema,
  createUpload415Schema,
  createUploadMutationResponseSchema,
  createUploadQueryParamsSchema,
} from './Uploads/createUploadSchema.ts'
import { deleteUpload204Schema, deleteUploadMutationResponseSchema, deleteUploadPathParamsSchema } from './Uploads/deleteUploadSchema.ts'
import { fetchUpload200Schema, fetchUpload404Schema, fetchUploadQueryResponseSchema, fetchUploadPathParamsSchema } from './Uploads/fetchUploadSchema.ts'
import { listUploads200Schema, listUploadsQueryResponseSchema, listUploadsQueryParamsSchema } from './Uploads/listUploadsSchema.ts'
import { clockInMutationRequestSchema, clockIn201Schema, clockIn400Schema, clockIn403Schema, clockInMutationResponseSchema } from './Users/clockInSchema.ts'
import { clockOutMutationRequestSchema, clockOut204Schema, clockOut403Schema, clockOutMutationResponseSchema } from './Users/clockOutSchema.ts'
import {
  createUserMutationRequestSchema,
  createUser201Schema,
  createUser404Schema,
  createUser409Schema,
  createUserMutationResponseSchema,
} from './Users/createUserSchema.ts'
import {
  downloadUsersMutationRequestSchema,
  downloadUsers200Schema,
  downloadUsers400Schema,
  downloadUsersMutationResponseSchema,
  downloadUsersQueryParamsSchema,
} from './Users/downloadUsersSchema.ts'
import { getMe200Schema, getMe404Schema, getMeQueryResponseSchema, getMeQueryParamsSchema } from './Users/getMeSchema.ts'
import { getUser200Schema, getUser404Schema, getUserQueryResponseSchema, getUserPathParamsSchema } from './Users/getUserSchema.ts'
import { listUsers200Schema, listUsersQueryResponseSchema, listUsersQueryParamsSchema } from './Users/listUsersSchema.ts'
import {
  replaceMyPasswordMutationRequestSchema,
  replaceMyPassword204Schema,
  replaceMyPassword400Schema,
  replaceMyPasswordMutationResponseSchema,
} from './Users/replaceMyPasswordSchema.ts'
import {
  replaceMyProfilePictureMutationRequestSchema,
  replaceMyProfilePicture201Schema,
  replaceMyProfilePicture404Schema,
  replaceMyProfilePicture413Schema,
  replaceMyProfilePicture415Schema,
  replaceMyProfilePictureMutationResponseSchema,
} from './Users/replaceMyProfilePictureSchema.ts'
import {
  replacePasswordMutationRequestSchema,
  replacePassword204Schema,
  replacePasswordMutationResponseSchema,
  replacePasswordPathParamsSchema,
} from './Users/replacePasswordSchema.ts'
import {
  replaceUserProfilePictureMutationRequestSchema,
  replaceUserProfilePicture201Schema,
  replaceUserProfilePicture404Schema,
  replaceUserProfilePicture413Schema,
  replaceUserProfilePicture415Schema,
  replaceUserProfilePictureMutationResponseSchema,
  replaceUserProfilePicturePathParamsSchema,
} from './Users/replaceUserProfilePictureSchema.ts'
import {
  replaceUserMutationRequestSchema,
  replaceUser200Schema,
  replaceUser404Schema,
  replaceUserMutationResponseSchema,
  replaceUserPathParamsSchema,
} from './Users/replaceUserSchema.ts'
import { resignUser204Schema, resignUserMutationResponseSchema, resignUserPathParamsSchema } from './Users/resignUserSchema.ts'

export const operations = {
  listAttendanceRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listAttendanceRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listAttendanceRecords200Schema,
      default: listAttendanceRecordsQueryResponseSchema,
    },
    errors: {},
  },
  createAttendanceRecord: {
    request: createAttendanceRecordMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createAttendanceRecord201Schema,
      400: createAttendanceRecord400Schema,
      404: createAttendanceRecord404Schema,
      409: createAttendanceRecord409Schema,
      default: createAttendanceRecordMutationResponseSchema,
    },
    errors: {
      400: createAttendanceRecord400Schema,
      404: createAttendanceRecord404Schema,
      409: createAttendanceRecord409Schema,
    },
  },
  downloadAttendanceRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: downloadAttendanceRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadAttendanceRecords200Schema,
      400: downloadAttendanceRecords400Schema,
      default: downloadAttendanceRecordsQueryResponseSchema,
    },
    errors: {
      400: downloadAttendanceRecords400Schema,
    },
  },
  getAttendanceRecord: {
    request: undefined,
    parameters: {
      path: getAttendanceRecordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getAttendanceRecord200Schema,
      404: getAttendanceRecord404Schema,
      default: getAttendanceRecordQueryResponseSchema,
    },
    errors: {
      404: getAttendanceRecord404Schema,
    },
  },
  replaceAttendanceRecord: {
    request: replaceAttendanceRecordMutationRequestSchema,
    parameters: {
      path: replaceAttendanceRecordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: replaceAttendanceRecord201Schema,
      400: replaceAttendanceRecord400Schema,
      404: replaceAttendanceRecord404Schema,
      409: replaceAttendanceRecord409Schema,
      default: replaceAttendanceRecordMutationResponseSchema,
    },
    errors: {
      400: replaceAttendanceRecord400Schema,
      404: replaceAttendanceRecord404Schema,
      409: replaceAttendanceRecord409Schema,
    },
  },
  listCalendarEvents: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listCalendarEventsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listCalendarEvents200Schema,
      default: listCalendarEventsQueryResponseSchema,
    },
    errors: {},
  },
  upsertCalendarEvent: {
    request: upsertCalendarEventMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: upsertCalendarEvent200Schema,
      default: upsertCalendarEventMutationResponseSchema,
    },
    errors: {},
  },
  deleteCalendarEvent: {
    request: undefined,
    parameters: {
      path: undefined,
      query: deleteCalendarEventQueryParamsSchema,
      header: undefined,
    },
    responses: {
      204: deleteCalendarEvent204Schema,
      400: deleteCalendarEvent400Schema,
      404: deleteCalendarEvent404Schema,
      default: deleteCalendarEventMutationResponseSchema,
    },
    errors: {
      400: deleteCalendarEvent400Schema,
      404: deleteCalendarEvent404Schema,
    },
  },
  listClockRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listClockRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listClockRecords200Schema,
      default: listClockRecordsQueryResponseSchema,
    },
    errors: {},
  },
  approveClockRecords: {
    request: approveClockRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: approveClockRecords204Schema,
      400: approveClockRecords400Schema,
      404: approveClockRecords404Schema,
      default: approveClockRecordsMutationResponseSchema,
    },
    errors: {
      400: approveClockRecords400Schema,
      404: approveClockRecords404Schema,
    },
  },
  getClockRecord: {
    request: undefined,
    parameters: {
      path: getClockRecordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getClockRecord200Schema,
      404: getClockRecord404Schema,
      default: getClockRecordQueryResponseSchema,
    },
    errors: {
      404: getClockRecord404Schema,
    },
  },
  listEmployeeDesignations: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: listEmployeeDesignations200Schema,
      default: listEmployeeDesignationsQueryResponseSchema,
    },
    errors: {},
  },
  listLeaveRequestTypes: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: listLeaveRequestTypes200Schema,
      default: listLeaveRequestTypesQueryResponseSchema,
    },
    errors: {},
  },
  listModules: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: listModules200Schema,
      default: listModulesQueryResponseSchema,
    },
    errors: {},
  },
  listUploadCategories: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: listUploadCategories200Schema,
      default: listUploadCategoriesQueryResponseSchema,
    },
    errors: {},
  },
  createSalaryRecords: {
    request: createSalaryRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: createSalaryRecords204Schema,
      default: createSalaryRecordsMutationResponseSchema,
    },
    errors: {},
  },
  recalculateProjectContributionRecords: {
    request: recalculateProjectContributionRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: recalculateProjectContributionRecords204Schema,
      default: recalculateProjectContributionRecordsMutationResponseSchema,
    },
    errors: {},
  },
  resetRemainingLeaves: {
    request: resetRemainingLeavesMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: resetRemainingLeaves204Schema,
      default: resetRemainingLeavesMutationResponseSchema,
    },
    errors: {},
  },
  upsertOngoingProjectWorkTimeRecords: {
    request: upsertOngoingProjectWorkTimeRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: upsertOngoingProjectWorkTimeRecords204Schema,
      default: upsertOngoingProjectWorkTimeRecordsMutationResponseSchema,
    },
    errors: {},
  },
  upsertWorkBehaviorRecords: {
    request: upsertWorkBehaviorRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: upsertWorkBehaviorRecords204Schema,
      default: upsertWorkBehaviorRecordsMutationResponseSchema,
    },
    errors: {},
  },
  upsertWorkBehaviorRecords4Salary: {
    request: upsertWorkBehaviorRecords4SalaryMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: upsertWorkBehaviorRecords4Salary204Schema,
      default: upsertWorkBehaviorRecords4SalaryMutationResponseSchema,
    },
    errors: {},
  },
  listDivisions: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listDivisionsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listDivisions200Schema,
      default: listDivisionsQueryResponseSchema,
    },
    errors: {},
  },
  createDivision: {
    request: createDivisionMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createDivision201Schema,
      default: createDivisionMutationResponseSchema,
    },
    errors: {},
  },
  getDivision: {
    request: undefined,
    parameters: {
      path: getDivisionPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getDivision200Schema,
      404: getDivision404Schema,
      default: getDivisionQueryResponseSchema,
    },
    errors: {
      404: getDivision404Schema,
    },
  },
  replaceDivision: {
    request: replaceDivisionMutationRequestSchema,
    parameters: {
      path: replaceDivisionPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceDivision200Schema,
      404: replaceDivision404Schema,
      default: replaceDivisionMutationResponseSchema,
    },
    errors: {
      404: replaceDivision404Schema,
    },
  },
  listLeaveRequests: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listLeaveRequestsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listLeaveRequests200Schema,
      default: listLeaveRequestsQueryResponseSchema,
    },
    errors: {},
  },
  createLeaveRequests: {
    request: createLeaveRequestsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createLeaveRequests201Schema,
      400: createLeaveRequests400Schema,
      404: createLeaveRequests404Schema,
      409: createLeaveRequests409Schema,
      default: createLeaveRequestsMutationResponseSchema,
    },
    errors: {
      400: createLeaveRequests400Schema,
      404: createLeaveRequests404Schema,
      409: createLeaveRequests409Schema,
    },
  },
  reviewLeaveRequests: {
    request: reviewLeaveRequestsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: reviewLeaveRequests204Schema,
      400: reviewLeaveRequests400Schema,
      404: reviewLeaveRequests404Schema,
      409: reviewLeaveRequests409Schema,
      default: reviewLeaveRequestsMutationResponseSchema,
    },
    errors: {
      400: reviewLeaveRequests400Schema,
      404: reviewLeaveRequests404Schema,
      409: reviewLeaveRequests409Schema,
    },
  },
  getLeaveRequest: {
    request: undefined,
    parameters: {
      path: getLeaveRequestPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getLeaveRequest200Schema,
      404: getLeaveRequest404Schema,
      default: getLeaveRequestQueryResponseSchema,
    },
    errors: {
      404: getLeaveRequest404Schema,
    },
  },
  deleteLeaveRequest: {
    request: undefined,
    parameters: {
      path: deleteLeaveRequestPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: deleteLeaveRequest204Schema,
      400: deleteLeaveRequest400Schema,
      404: deleteLeaveRequest404Schema,
      default: deleteLeaveRequestMutationResponseSchema,
    },
    errors: {
      400: deleteLeaveRequest400Schema,
      404: deleteLeaveRequest404Schema,
    },
  },
  listProjectClients: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listProjectClientsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listProjectClients200Schema,
      default: listProjectClientsQueryResponseSchema,
    },
    errors: {},
  },
  createProjectClient: {
    request: createProjectClientMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createProjectClient201Schema,
      default: createProjectClientMutationResponseSchema,
    },
    errors: {},
  },
  getProjectClient: {
    request: undefined,
    parameters: {
      path: getProjectClientPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getProjectClient200Schema,
      404: getProjectClient404Schema,
      default: getProjectClientQueryResponseSchema,
    },
    errors: {
      404: getProjectClient404Schema,
    },
  },
  replaceProjectClient: {
    request: replaceProjectClientMutationRequestSchema,
    parameters: {
      path: replaceProjectClientPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceProjectClient200Schema,
      404: replaceProjectClient404Schema,
      default: replaceProjectClientMutationResponseSchema,
    },
    errors: {
      404: replaceProjectClient404Schema,
    },
  },
  getProjectEmployeeAssignments: {
    request: undefined,
    parameters: {
      path: undefined,
      query: getProjectEmployeeAssignmentsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getProjectEmployeeAssignments200Schema,
      default: getProjectEmployeeAssignmentsQueryResponseSchema,
    },
    errors: {},
  },
  listProjects: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listProjectsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listProjects200Schema,
      default: listProjectsQueryResponseSchema,
    },
    errors: {},
  },
  createProject: {
    request: createProjectMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createProject201Schema,
      default: createProjectMutationResponseSchema,
    },
    errors: {},
  },
  getProject: {
    request: undefined,
    parameters: {
      path: getProjectPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getProject200Schema,
      404: getProject404Schema,
      default: getProjectQueryResponseSchema,
    },
    errors: {
      404: getProject404Schema,
    },
  },
  replaceProject: {
    request: replaceProjectMutationRequestSchema,
    parameters: {
      path: replaceProjectPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceProject200Schema,
      404: replaceProject404Schema,
      default: replaceProjectMutationResponseSchema,
    },
    errors: {
      404: replaceProject404Schema,
    },
  },
  endProject: {
    request: undefined,
    parameters: {
      path: endProjectPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: endProject200Schema,
      403: endProject403Schema,
      404: endProject404Schema,
      409: endProject409Schema,
      default: endProjectMutationResponseSchema,
    },
    errors: {
      403: endProject403Schema,
      404: endProject404Schema,
      409: endProject409Schema,
    },
  },
  startProject: {
    request: undefined,
    parameters: {
      path: startProjectPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: startProject200Schema,
      404: startProject404Schema,
      409: startProject409Schema,
      default: startProjectMutationResponseSchema,
    },
    errors: {
      404: startProject404Schema,
      409: startProject409Schema,
    },
  },
  replaceEmployeeAssignments: {
    request: replaceEmployeeAssignmentsMutationRequestSchema,
    parameters: {
      path: replaceEmployeeAssignmentsPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: replaceEmployeeAssignments204Schema,
      400: replaceEmployeeAssignments400Schema,
      404: replaceEmployeeAssignments404Schema,
      409: replaceEmployeeAssignments409Schema,
      default: replaceEmployeeAssignmentsMutationResponseSchema,
    },
    errors: {
      400: replaceEmployeeAssignments400Schema,
      404: replaceEmployeeAssignments404Schema,
      409: replaceEmployeeAssignments409Schema,
    },
  },
  listRoles: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listRolesQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listRoles200Schema,
      default: listRolesQueryResponseSchema,
    },
    errors: {},
  },
  createRole: {
    request: createRoleMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createRole201Schema,
      default: createRoleMutationResponseSchema,
    },
    errors: {},
  },
  getRole: {
    request: undefined,
    parameters: {
      path: getRolePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getRole200Schema,
      404: getRole404Schema,
      default: getRoleQueryResponseSchema,
    },
    errors: {
      404: getRole404Schema,
    },
  },
  replaceRole: {
    request: replaceRoleMutationRequestSchema,
    parameters: {
      path: replaceRolePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceRole200Schema,
      404: replaceRole404Schema,
      default: replaceRoleMutationResponseSchema,
    },
    errors: {
      404: replaceRole404Schema,
    },
  },
  listRolePermissions: {
    request: undefined,
    parameters: {
      path: listRolePermissionsPathParamsSchema,
      query: listRolePermissionsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listRolePermissions200Schema,
      404: listRolePermissions404Schema,
      default: listRolePermissionsQueryResponseSchema,
    },
    errors: {
      404: listRolePermissions404Schema,
    },
  },
  replaceRolePermissions: {
    request: replaceRolePermissionsMutationRequestSchema,
    parameters: {
      path: replaceRolePermissionsPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: replaceRolePermissions204Schema,
      403: replaceRolePermissions403Schema,
      404: replaceRolePermissions404Schema,
      500: replaceRolePermissions500Schema,
      default: replaceRolePermissionsMutationResponseSchema,
    },
    errors: {
      403: replaceRolePermissions403Schema,
      404: replaceRolePermissions404Schema,
      500: replaceRolePermissions500Schema,
    },
  },
  listSalaryRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listSalaryRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listSalaryRecords200Schema,
      default: listSalaryRecordsQueryResponseSchema,
    },
    errors: {},
  },
  updateSalaryRecords: {
    request: updateSalaryRecordsMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: updateSalaryRecords204Schema,
      404: updateSalaryRecords404Schema,
      default: updateSalaryRecordsMutationResponseSchema,
    },
    errors: {
      404: updateSalaryRecords404Schema,
    },
  },
  downloadSalaryRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: downloadSalaryRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadSalaryRecords200Schema,
      400: downloadSalaryRecords400Schema,
      default: downloadSalaryRecordsQueryResponseSchema,
    },
    errors: {
      400: downloadSalaryRecords400Schema,
    },
  },
  getSalaryRecord: {
    request: undefined,
    parameters: {
      path: getSalaryRecordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getSalaryRecord200Schema,
      404: getSalaryRecord404Schema,
      default: getSalaryRecordQueryResponseSchema,
    },
    errors: {
      404: getSalaryRecord404Schema,
    },
  },
  replaceSalaryRecord: {
    request: replaceSalaryRecordMutationRequestSchema,
    parameters: {
      path: replaceSalaryRecordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceSalaryRecord200Schema,
      400: replaceSalaryRecord400Schema,
      404: replaceSalaryRecord404Schema,
      default: replaceSalaryRecordMutationResponseSchema,
    },
    errors: {
      400: replaceSalaryRecord400Schema,
      404: replaceSalaryRecord404Schema,
    },
  },
  createSession: {
    request: createSessionMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createSession201Schema,
      401: createSession401Schema,
      404: createSession404Schema,
      default: createSessionMutationResponseSchema,
    },
    errors: {
      401: createSession401Schema,
      404: createSession404Schema,
    },
  },
  summarizeProjectsByClockInLocation: {
    request: undefined,
    parameters: {
      path: undefined,
      query: summarizeProjectsByClockInLocationQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: summarizeProjectsByClockInLocation200Schema,
      default: summarizeProjectsByClockInLocationQueryResponseSchema,
    },
    errors: {},
  },
  listProjectContributionRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listProjectContributionRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listProjectContributionRecords200Schema,
      400: listProjectContributionRecords400Schema,
      default: listProjectContributionRecordsQueryResponseSchema,
    },
    errors: {
      400: listProjectContributionRecords400Schema,
    },
  },
  downloadProjectContributionRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: downloadProjectContributionRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadProjectContributionRecords200Schema,
      400: downloadProjectContributionRecords400Schema,
      404: downloadProjectContributionRecords404Schema,
      default: downloadProjectContributionRecordsQueryResponseSchema,
    },
    errors: {
      400: downloadProjectContributionRecords400Schema,
      404: downloadProjectContributionRecords404Schema,
    },
  },
  listProjectWorkTimeRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listProjectWorkTimeRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listProjectWorkTimeRecords200Schema,
      default: listProjectWorkTimeRecordsQueryResponseSchema,
    },
    errors: {},
  },
  summarizeAllUsersByAttendance: {
    request: undefined,
    parameters: {
      path: undefined,
      query: summarizeAllUsersByAttendanceQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: summarizeAllUsersByAttendance200Schema,
      default: summarizeAllUsersByAttendanceQueryResponseSchema,
    },
    errors: {},
  },
  summarizeEmployeeUsersByAttendance: {
    request: undefined,
    parameters: {
      path: undefined,
      query: summarizeEmployeeUsersByAttendanceQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: summarizeEmployeeUsersByAttendance200Schema,
      default: summarizeEmployeeUsersByAttendanceQueryResponseSchema,
    },
    errors: {},
  },
  listWorkBehaviorRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listWorkBehaviorRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listWorkBehaviorRecords200Schema,
      default: listWorkBehaviorRecordsQueryResponseSchema,
    },
    errors: {},
  },
  downloadWorkBehaviorRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: downloadWorkBehaviorRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadWorkBehaviorRecords200Schema,
      400: downloadWorkBehaviorRecords400Schema,
      default: downloadWorkBehaviorRecordsQueryResponseSchema,
    },
    errors: {
      400: downloadWorkBehaviorRecords400Schema,
    },
  },
  downloadWorkProjectRecords: {
    request: undefined,
    parameters: {
      path: undefined,
      query: downloadWorkProjectRecordsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadWorkProjectRecords200Schema,
      400: downloadWorkProjectRecords400Schema,
      default: downloadWorkProjectRecordsQueryResponseSchema,
    },
    errors: {
      400: downloadWorkProjectRecords400Schema,
    },
  },
  listUploads: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listUploadsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listUploads200Schema,
      default: listUploadsQueryResponseSchema,
    },
    errors: {},
  },
  createUpload: {
    request: createUploadMutationRequestSchema,
    parameters: {
      path: undefined,
      query: createUploadQueryParamsSchema,
      header: undefined,
    },
    responses: {
      201: createUpload201Schema,
      404: createUpload404Schema,
      413: createUpload413Schema,
      415: createUpload415Schema,
      default: createUploadMutationResponseSchema,
    },
    errors: {
      404: createUpload404Schema,
      413: createUpload413Schema,
      415: createUpload415Schema,
    },
  },
  deleteUpload: {
    request: undefined,
    parameters: {
      path: deleteUploadPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: deleteUpload204Schema,
      default: deleteUploadMutationResponseSchema,
    },
    errors: {},
  },
  fetchUpload: {
    request: undefined,
    parameters: {
      path: fetchUploadPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: fetchUpload200Schema,
      404: fetchUpload404Schema,
      default: fetchUploadQueryResponseSchema,
    },
    errors: {
      404: fetchUpload404Schema,
    },
  },
  listUsers: {
    request: undefined,
    parameters: {
      path: undefined,
      query: listUsersQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: listUsers200Schema,
      default: listUsersQueryResponseSchema,
    },
    errors: {},
  },
  createUser: {
    request: createUserMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: createUser201Schema,
      404: createUser404Schema,
      409: createUser409Schema,
      default: createUserMutationResponseSchema,
    },
    errors: {
      404: createUser404Schema,
      409: createUser409Schema,
    },
  },
  getMe: {
    request: undefined,
    parameters: {
      path: undefined,
      query: getMeQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: getMe200Schema,
      404: getMe404Schema,
      default: getMeQueryResponseSchema,
    },
    errors: {
      404: getMe404Schema,
    },
  },
  clockIn: {
    request: clockInMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: clockIn201Schema,
      400: clockIn400Schema,
      403: clockIn403Schema,
      default: clockInMutationResponseSchema,
    },
    errors: {
      400: clockIn400Schema,
      403: clockIn403Schema,
    },
  },
  clockOut: {
    request: clockOutMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: clockOut204Schema,
      403: clockOut403Schema,
      default: clockOutMutationResponseSchema,
    },
    errors: {
      403: clockOut403Schema,
    },
  },
  replaceMyPassword: {
    request: replaceMyPasswordMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: replaceMyPassword204Schema,
      400: replaceMyPassword400Schema,
      default: replaceMyPasswordMutationResponseSchema,
    },
    errors: {
      400: replaceMyPassword400Schema,
    },
  },
  replaceMyProfilePicture: {
    request: replaceMyProfilePictureMutationRequestSchema,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: replaceMyProfilePicture201Schema,
      404: replaceMyProfilePicture404Schema,
      413: replaceMyProfilePicture413Schema,
      415: replaceMyProfilePicture415Schema,
      default: replaceMyProfilePictureMutationResponseSchema,
    },
    errors: {
      404: replaceMyProfilePicture404Schema,
      413: replaceMyProfilePicture413Schema,
      415: replaceMyProfilePicture415Schema,
    },
  },
  downloadUsers: {
    request: downloadUsersMutationRequestSchema,
    parameters: {
      path: undefined,
      query: downloadUsersQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: downloadUsers200Schema,
      400: downloadUsers400Schema,
      default: downloadUsersMutationResponseSchema,
    },
    errors: {
      400: downloadUsers400Schema,
    },
  },
  getUser: {
    request: undefined,
    parameters: {
      path: getUserPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: getUser200Schema,
      404: getUser404Schema,
      default: getUserQueryResponseSchema,
    },
    errors: {
      404: getUser404Schema,
    },
  },
  replaceUser: {
    request: replaceUserMutationRequestSchema,
    parameters: {
      path: replaceUserPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: replaceUser200Schema,
      404: replaceUser404Schema,
      default: replaceUserMutationResponseSchema,
    },
    errors: {
      404: replaceUser404Schema,
    },
  },
  resignUser: {
    request: undefined,
    parameters: {
      path: resignUserPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: resignUser204Schema,
      default: resignUserMutationResponseSchema,
    },
    errors: {},
  },
  replacePassword: {
    request: replacePasswordMutationRequestSchema,
    parameters: {
      path: replacePasswordPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      204: replacePassword204Schema,
      default: replacePasswordMutationResponseSchema,
    },
    errors: {},
  },
  replaceUserProfilePicture: {
    request: replaceUserProfilePictureMutationRequestSchema,
    parameters: {
      path: replaceUserProfilePicturePathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      201: replaceUserProfilePicture201Schema,
      404: replaceUserProfilePicture404Schema,
      413: replaceUserProfilePicture413Schema,
      415: replaceUserProfilePicture415Schema,
      default: replaceUserProfilePictureMutationResponseSchema,
    },
    errors: {
      404: replaceUserProfilePicture404Schema,
      413: replaceUserProfilePicture413Schema,
      415: replaceUserProfilePicture415Schema,
    },
  },
} as const

export const paths = {
  '/attendanceRecords': {
    get: operations['listAttendanceRecords'],
    post: operations['createAttendanceRecord'],
  },
  '/attendanceRecords/_download': {
    get: operations['downloadAttendanceRecords'],
  },
  '/attendanceRecords/:id': {
    get: operations['getAttendanceRecord'],
    put: operations['replaceAttendanceRecord'],
  },
  '/calendarEvents': {
    get: operations['listCalendarEvents'],
    put: operations['upsertCalendarEvent'],
    delete: operations['deleteCalendarEvent'],
  },
  '/clockRecords': {
    get: operations['listClockRecords'],
  },
  '/clockRecords/_approve': {
    post: operations['approveClockRecords'],
  },
  '/clockRecords/:id': {
    get: operations['getClockRecord'],
  },
  '/constants/employeeDesignation': {
    get: operations['listEmployeeDesignations'],
  },
  '/constants/leaveRequestTypes': {
    get: operations['listLeaveRequestTypes'],
  },
  '/constants/modules': {
    get: operations['listModules'],
  },
  '/constants/uploadCategories': {
    get: operations['listUploadCategories'],
  },
  '/debuggers/crons/createSalaryRecords': {
    post: operations['createSalaryRecords'],
  },
  '/debuggers/crons/recalculateProjectContributionRecords': {
    post: operations['recalculateProjectContributionRecords'],
  },
  '/debuggers/crons/resetRemainingLeaves': {
    post: operations['resetRemainingLeaves'],
  },
  '/debuggers/crons/upsertOngoingProjectWorkTimeRecords': {
    post: operations['upsertOngoingProjectWorkTimeRecords'],
  },
  '/debuggers/crons/upsertWorkBehaviorRecords': {
    post: operations['upsertWorkBehaviorRecords'],
  },
  '/debuggers/crons/upsertWorkBehaviorRecords4Salary': {
    post: operations['upsertWorkBehaviorRecords4Salary'],
  },
  '/divisions': {
    get: operations['listDivisions'],
    post: operations['createDivision'],
  },
  '/divisions/:id': {
    get: operations['getDivision'],
    put: operations['replaceDivision'],
  },
  '/leaveRequests': {
    get: operations['listLeaveRequests'],
    post: operations['createLeaveRequests'],
  },
  '/leaveRequests/_review': {
    put: operations['reviewLeaveRequests'],
  },
  '/leaveRequests/:id': {
    get: operations['getLeaveRequest'],
    delete: operations['deleteLeaveRequest'],
  },
  '/projectClients': {
    get: operations['listProjectClients'],
    post: operations['createProjectClient'],
  },
  '/projectClients/:id': {
    get: operations['getProjectClient'],
    put: operations['replaceProjectClient'],
  },
  '/projectEmployeeAssignments': {
    get: operations['getProjectEmployeeAssignments'],
  },
  '/projects': {
    get: operations['listProjects'],
    post: operations['createProject'],
  },
  '/projects/:id': {
    get: operations['getProject'],
    put: operations['replaceProject'],
  },
  '/projects/:id/_end': {
    post: operations['endProject'],
  },
  '/projects/:id/_start': {
    post: operations['startProject'],
  },
  '/projects/:id/employees': {
    put: operations['replaceEmployeeAssignments'],
  },
  '/roles': {
    get: operations['listRoles'],
    post: operations['createRole'],
  },
  '/roles/:id': {
    get: operations['getRole'],
    put: operations['replaceRole'],
  },
  '/roles/:id/permissions': {
    get: operations['listRolePermissions'],
    put: operations['replaceRolePermissions'],
  },
  '/salaryRecords': {
    get: operations['listSalaryRecords'],
    put: operations['updateSalaryRecords'],
  },
  '/salaryRecords/_download': {
    get: operations['downloadSalaryRecords'],
  },
  '/salaryRecords/:id': {
    get: operations['getSalaryRecord'],
    put: operations['replaceSalaryRecord'],
  },
  '/sessions': {
    post: operations['createSession'],
  },
  '/summaries/projects/byClockInLocation': {
    get: operations['summarizeProjectsByClockInLocation'],
  },
  '/summaries/projects/projectContributionRecords': {
    get: operations['listProjectContributionRecords'],
  },
  '/summaries/projects/projectContributionRecords/_download': {
    get: operations['downloadProjectContributionRecords'],
  },
  '/summaries/projects/workTimeRecords': {
    get: operations['listProjectWorkTimeRecords'],
  },
  '/summaries/users/all/byAttendance': {
    get: operations['summarizeAllUsersByAttendance'],
  },
  '/summaries/users/employee/byAttendance': {
    get: operations['summarizeEmployeeUsersByAttendance'],
  },
  '/summaries/users/workBehaviorRecords': {
    get: operations['listWorkBehaviorRecords'],
  },
  '/summaries/users/workBehaviorRecords/_download': {
    get: operations['downloadWorkBehaviorRecords'],
  },
  '/summaries/users/workProjectRecords/_download': {
    get: operations['downloadWorkProjectRecords'],
  },
  '/uploads': {
    get: operations['listUploads'],
    post: operations['createUpload'],
  },
  '/uploads/:id': {
    delete: operations['deleteUpload'],
  },
  '/uploads/:staticPath': {
    get: operations['fetchUpload'],
  },
  '/users': {
    get: operations['listUsers'],
    post: operations['createUser'],
  },
  '/users/@me': {
    get: operations['getMe'],
  },
  '/users/@me/_clockIn': {
    post: operations['clockIn'],
  },
  '/users/@me/_clockOut': {
    post: operations['clockOut'],
  },
  '/users/@me/password': {
    put: operations['replaceMyPassword'],
  },
  '/users/@me/profilePicture': {
    put: operations['replaceMyProfilePicture'],
  },
  '/users/_download': {
    post: operations['downloadUsers'],
  },
  '/users/:id': {
    get: operations['getUser'],
    put: operations['replaceUser'],
  },
  '/users/:id/_resign': {
    post: operations['resignUser'],
  },
  '/users/:id/password': {
    put: operations['replacePassword'],
  },
  '/users/:id/profilePicture': {
    put: operations['replaceUserProfilePicture'],
  },
} as const