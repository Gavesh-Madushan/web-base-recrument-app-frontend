import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { _setBlobToFile, convert_to_proper_case, convertToCents, convertToRupees } from "../../../../utils/utils";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import { gridSpacing, IMAGE_SIZE, IMAGE_SUPPORTED_FORMATS } from "../../../../store/constants";
import { StaffService } from "../../../../assets/_services/staff-service";

// custom components
import MainCard from "../../../../utils/ui-components/MainCard";
import Select from "../../../../utils/ui-components/FormsUI/Select";
import PageHeaders from "../../../../utils/ui-components/PageHeaders";
import TextField from "../../../../utils/ui-components/FormsUI/TextField";
import SwitchWrapper from "../../../../utils/ui-components/FormsUI/Switch";
import CheckboxWrapper from "../../../../utils/ui-components/FormsUI/Checkbox";
import DateTimePicker from "../../../../utils/ui-components/FormsUI/DatePicker";
import { openSuccessDialog } from "../../../../utils/ui-components/pop-ups/SuccessDialog";
// import FileUpload from "../../../../utils/ui-components/FormsUI/fileUpload/file-upload.component";
import { closeConfirmDialog, openConfirmDialog } from "../../../../utils/ui-components/pop-ups/ConfirmDialog";
import ItemImageUpload from "../../../../utils/ui-components/FormsUI/ItemImageUpload/item-image-upload.component";

// mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";

// mui icons
import LockIcon from "@mui/icons-material/Lock";
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { UploadService } from "../../../../assets/_services/upload-service";
import LeaveEligibility from "./LeaveEligibility";

export interface CreateEmpInterface {
  empDetails: {
    empImg: object;
    profilePicturePath: string | null;
    empNo: string;
    division: string | number;
    nic: string;
    nameWithInitials: string;
    fullName: string;
    address: string;
    dob: Dayjs;
    joinDate: Dayjs;
    resignDate: Dayjs | null;
    activeState: boolean;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
    class: string;
    designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "";
  };
  empSalary: {
    basic: number;
    budgetedAllowance: number;
    consoleBasic: number;
    wage: number;
    allowance: number;
    vehicleAllowance: number;
    travelAllowance: number;
    grossSalary: number;
    overTime: boolean;
    salaryPerOtHour: number;
    bata: boolean;
    salaryBata: number;
    outstation: boolean;
    salaryOutstationPerDay: number;
    percentageEpf8: number;
    percentageEpf12: number;
    percentageEtf: number;
  };
  leaveEligibility: {
    entitledLeaveDaysAnnual: number;
    entitledLeaveDaysMedical: number;
    entitledLeaveDaysCasual: number;
  };
  documents: {
    files: Array<File>;
  };
}

function CreateEmployee() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { id } = useParams();

  const theme: any = useTheme();
  const navigate = useNavigate();

  const [initialItem, setInitialItem] = useState<CreateEmpInterface>({
    empDetails: {
      empImg: {},
      profilePicturePath: "",
      empNo: "",
      division: "",
      nic: "",
      nameWithInitials: "",
      fullName: "",
      address: "",
      dob: dayjs(),
      joinDate: dayjs(),
      resignDate: null,
      activeState: true,
      mobile: "",
      email: "",
      designation: "",
      password: "",
      confirmPassword: "",
      class: "",
    },
    empSalary: {
      basic: 0,
      budgetedAllowance: 0,
      consoleBasic: 0,
      wage: 0,
      allowance: 0,
      vehicleAllowance: 0,
      travelAllowance: 0,
      grossSalary: 0,
      overTime: true,
      salaryPerOtHour: 0,
      bata: true,
      salaryBata: 0,
      outstation: true,
      salaryOutstationPerDay: 0,
      percentageEpf8: 0,
      percentageEpf12: 0,
      percentageEtf: 0,
    },
    leaveEligibility: {
      entitledLeaveDaysAnnual: 0,
      entitledLeaveDaysMedical: 0,
      entitledLeaveDaysCasual: 0,
    },
    documents: {
      files: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [employeeTypes, setEmployeeTypes] = useState<{ value: string; label: string }[]>([]);
  const [divisions, setDivisions] = useState<{ value: number; label: string }[]>([]);
  const [passwordShow, setPasswordShow] = useState({
    password: "",
    showPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Employee",
          path: "/staff/employee",
          bold: false,
          state: state,
        },
        {
          name: Number(id) !== 0 ? "Update" : "Create",
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
    StaffService.getEmployeeDesignationList().then((response) => {
      if (response.isSuccess) {
        setEmployeeTypes(
          response.data.map((empType) => ({
            value: empType,
            label: convert_to_proper_case(empType),
          }))
        );
      } else {
        setEmployeeTypes([]);
      }
    });
    StaffService.getDivisionList({ headEmpId: undefined, searchTerm: undefined }, 0, 50).then((response) => {
      if (response.isSuccess) {
        setDivisions(
          response.data.data.map((division) => ({
            value: division?.id,
            label: division?.name,
          }))
        );
      } else {
        setDivisions([]);
      }
    });
    if (Number(id) !== 0) {
      getEmployee();
    }
  }, []);

  const fetchImage = async (path: string) => {
    try {
      const response = await UploadService.getFile(path);
      return await _setBlobToFile(response, path.split("/").pop()); // Ensure _setImage returns something if needed
    } catch (error) {
      console.error("Error fetching image:", error);
      return null; // Handle errors properly
    }
  };

  const getEmployee = () => {
    StaffService.getEmployee(Number(id)).then(async (response) => {
      if (response.isSuccess) {
        let imageFile;
        if (!response.data?.profilePicturePath) {
          imageFile = {};
        } else {
          await fetchImage(response.data.profilePicturePath).then((file) => {
            imageFile = file; // File object
          });
        }

        setInitialItem({
          empDetails: {
            empImg: imageFile,
            profilePicturePath: response.data.profilePicturePath,
            empNo: response.data.employeeNumber,
            division: response.data.divisionId,
            nic: response.data.nic,
            nameWithInitials: response.data.nameInitials,
            fullName: response.data.name,
            address: response.data.address,
            dob: dayjs(response.data.birthDate),
            joinDate: dayjs(response.data.createdAt),
            resignDate: dayjs(response.data.resignedAt),
            activeState: response.data.activeState === "ACTIVE" ? true : false,
            mobile: response.data.mobile,
            email: response.data.email || "",
            designation: response.data.designation,
            password: "",
            confirmPassword: "",
            class: response.data.class,
          },
          empSalary: {
            basic: convertToRupees(response.data.salaryBasic),
            budgetedAllowance: convertToRupees(response.data.salaryBudgeted),
            consoleBasic: convertToRupees(response.data.salaryBasic + response.data.salaryBudgeted),
            wage: convertToRupees(response.data.salaryWages),
            allowance: convertToRupees(response.data.salaryAllowance),
            vehicleAllowance: convertToRupees(response.data.salaryVehicleAllowance),
            travelAllowance: convertToRupees(response.data.salaryTravelAllowance),
            grossSalary: convertToRupees(
              response.data.salaryBasic +
                response.data.salaryBudgeted +
                response.data.salaryWages +
                response.data.salaryAllowance +
                response.data.salaryVehicleAllowance +
                response.data.salaryTravelAllowance
            ),
            overTime: response.data.salaryOtPerHour === 0 ? false : true,
            salaryPerOtHour: convertToRupees(response.data.salaryOtPerHour),
            bata: response.data.salaryBata === 0 ? false : true,
            salaryBata: convertToRupees(response.data.salaryBata),
            outstation: response.data.salaryOutstationPerDay === 0 ? false : true,
            salaryOutstationPerDay: convertToRupees(response.data.salaryOutstationPerDay),

            percentageEpf8: response.data.percentageEpf8,
            percentageEpf12: response.data.percentageEpf12,
            percentageEtf: response.data.percentageEtf,
          },
          leaveEligibility: {
            entitledLeaveDaysAnnual: response.data.entitledLeaveDaysAnnual,
            entitledLeaveDaysCasual: response.data.entitledLeaveDaysCasual,
            entitledLeaveDaysMedical: response.data.entitledLeaveDaysMedical,
          },
          documents: {
            files: [],
          },
        });
      } else {
        setDivisions([]);
      }
    });
  };

  const FORM_VALIDATION = Yup.object().shape({
    empDetails: Yup.object().shape({
      empImg: Yup.mixed()
        .nullable()
        .notRequired()
        .test("FILE_SIZE", "Uploaded file is too big.", (value: any) => {
          return !(value instanceof File) || (value && value?.size <= IMAGE_SIZE);
        })
        .test("FILE_FORMAT", "Uploaded file has unsupported format.", (value: any) => {
          return !(value instanceof File) || (value && IMAGE_SUPPORTED_FORMATS.includes(`${value?.type},`));
        }),
      empNo: Yup.string()
        .required("Please enter employee number")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      division: Yup.string().required("Please select division"),
      nic: Yup.string()
        .required("Please enter NIC number")
        .matches(
          /^(?:\d{9}[VX]|\d{12})$/,
          "Invalid NIC format. Use 9 digits followed by 'V' (e.g., 123456789V) or 12-digit number (e.g., 200012345678)."
        ),
      nameWithInitials: Yup.string()
        .required("Please enter name with initials")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      fullName: Yup.string()
        .required("Please enter full name")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      class: Yup.string()
        .max(50, "Maximun character count 50")
        .required("Please enter designation name")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      address: Yup.string()
        .required("Please enter address")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      dob: Yup.date().required("Please select date of birth").max(dayjs(), "Date of birth cannot be in the future"),
      joinDate: Yup.date().required("Please select employee joined date").max(dayjs(), "Joined date cannot be in the future"),
      resignDate: Yup.string().notRequired(),
      activeState: Yup.boolean().notRequired(),
      mobile: Yup.string()
        .required("Please enter company contact number")
        .matches(/^((0)(?:|7(0|1|2|4|5|6|7|8)\d)\d{6},?)+$/, "Invalid mobile numbers pattern detected (e.g.., 07xxxxxxx)"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Please email address")
        .trim("Cannot start or end with a space")
        .strict()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      designation: Yup.string().required("Please select employee class"),
      password: Yup.string()
        .max(255)
        .test("required", "Please enter employee password", function (val) {
          return Number(id) === 0 ? !!val : true;
        })
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirmPassword: Yup.string()
        .max(255)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        )
        .oneOf([Yup.ref("password")], "Your passwords do not match.")
        .test("required", "Please confirm employee password", function (val) {
          return Number(id) === 0 ? !!val : true;
        }),
    }),
    empSalary: Yup.object().shape({
      basic: Yup.number().required("Please enter basic salary"),
      budgetedAllowance: Yup.number().required("Please enter budgeted allowance"),
      consoleBasic: Yup.number().required("Please enter console basic salary"),
      wage: Yup.number().required("Please enter wage amount"),
      allowance: Yup.number().required("Please enter allowance"),
      vehicleAllowance: Yup.number().required("Please enter vehicle allowanve"),
      travelAllowance: Yup.number().required("Please enter travel allowance"),
      grossSalary: Yup.number().required("Please enter gross salary"),
      percentageEpf8: Yup.number().required("Please enter EPF 8%"),
      percentageEpf12: Yup.number().required("Please enter EPF 12%"),
      percentageEtf: Yup.number().required("Please enter ETF"),
      overTime: Yup.boolean().notRequired(),
      salaryPerOtHour: Yup.number().when("overTime", {
        is: (val: any) => val === true,
        then: (schema: any) => schema.required("Please enter salary per ot hour").moreThan(0, "Salary must be greater than 0"),
        otherwise: (schema: any) => schema.notRequired(),
      }),
      bata: Yup.boolean().notRequired(),
      salaryBata: Yup.number().when("bata", {
        is: (val: any) => val === true,
        then: (schema: any) => schema.required("Please enter bata salary").moreThan(0, "Salary must be greater than 0"),
        otherwise: (schema: any) => schema.notRequired(),
      }),
      outstation: Yup.boolean().notRequired(),
      salaryOutstationPerDay: Yup.number().when("outstation", {
        is: (val: any) => val === true,
        then: (schema: any) => schema.required("Please enter gross salary").moreThan(0, "Salary must be greater than 0"),
        otherwise: (schema: any) => schema.notRequired(),
      }),
    }),
    leaveEligibility: Yup.object().shape({
      entitledLeaveDaysAnnual: Yup.number().required("Please enter entitled leave days annual"),
      entitledLeaveDaysCasual: Yup.number().required("Please enter entitled leave days casual"),
      entitledLeaveDaysMedical: Yup.number().required("Please enter entitled leave days medical"),
    }),
    documents: Yup.object().shape({
      file: Yup.array().notRequired(),
    }),
  });

  const handleClickShowPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showPassword: !passwordShow.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showConfirmPassword: !passwordShow.showConfirmPassword,
    });
  };

  const createUser = (itemData: CreateEmpInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const values = {
      mobile: itemData.empDetails.mobile,
      empNo: itemData.empDetails.empNo,
      roleId: (() => {
        switch (itemData.empDetails.designation) {
          case "MANAGER":
            return 1 as number;
          case "DIVISION_HEAD":
            return 2 as number;
          case "HR_MANAGER":
            return 3 as number;
          case "FINANCE_MANAGER":
            return 4 as number;
          case "ENGINEER":
            return 5 as number;
          case "TECHNICIAN":
            return 5 as number;
          case "ASSISTANT_ENGINEER":
            return 5 as number;
          default:
            return 0 as number;
        }
      })(),
      divisionId: Number(itemData.empDetails.division),
      designation: itemData.empDetails.designation as
        | "MANAGER"
        | "DIVISION_HEAD"
        | "HR_MANAGER"
        | "FINANCE_MANAGER"
        | "ENGINEER"
        | "TECHNICIAN"
        | "ASSISTANT_ENGINEER",
      activeState: itemData.empDetails.activeState ? ("ACTIVE" as const) : ("INACTIVE" as const),
      name: itemData.empDetails.fullName,
      nameInitials: itemData.empDetails.nameWithInitials,
      email: itemData.empDetails.email,
      nic: itemData.empDetails.nic,
      address: itemData.empDetails.address,
      birthDate: itemData.empDetails.dob.toISOString(),
      joinDate: itemData.empDetails.joinDate.toISOString(),
      salaryBasic: convertToCents(itemData.empSalary.basic),
      salaryBudgeted: convertToCents(itemData.empSalary.budgetedAllowance),
      salaryWage: convertToCents(itemData.empSalary.wage),
      salaryAllowance: convertToCents(itemData.empSalary.allowance),
      salaryVehicleAllowance: convertToCents(itemData.empSalary.vehicleAllowance),
      salaryTravelAllowance: convertToCents(itemData.empSalary.travelAllowance),
      salaryOtPerHour: itemData.empSalary.overTime ? convertToCents(itemData.empSalary.salaryPerOtHour) : 0,
      salaryBata: itemData.empSalary.bata ? convertToCents(itemData.empSalary.salaryBata) : 0,
      salarayOutstationPerDay: itemData.empSalary.outstation ? convertToCents(itemData.empSalary.salaryOutstationPerDay) : 0,
      password: itemData.empDetails.password,
      class: itemData.empDetails.class,
      entitledLeaveDaysAnnual: itemData.leaveEligibility.entitledLeaveDaysAnnual,
      entitledLeaveDaysCasual: itemData.leaveEligibility.entitledLeaveDaysCasual,
      entitledLeaveDaysMedical: itemData.leaveEligibility.entitledLeaveDaysMedical,
      percentageEpf8: itemData.empSalary.percentageEpf8,
      percentageEpf12: itemData.empSalary.percentageEpf12,
      percentageEtf: itemData.empSalary.percentageEtf,
    };
    StaffService.createEmployee(values).then(async (response) => {
      if (response.isSuccess) {
        if (itemData.empDetails.empImg instanceof File) {
          await uploadImage(itemData.empDetails.empImg, response.data.id);
        }
        openSuccessDialog("Success", `${itemData.empDetails.nameWithInitials} employee created successfully`);
        setIsLoading(false);
        navigate("/staff/employee", { state: state });
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const updateUser = (itemData: CreateEmpInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const values = {
      id: Number(id),
      mobile: itemData.empDetails.mobile,
      profilePicturePath: itemData.empDetails.profilePicturePath,
      roleId: (() => {
        switch (itemData.empDetails.designation) {
          case "MANAGER":
            return 1 as number;
          case "DIVISION_HEAD":
            return 2 as number;
          case "HR_MANAGER":
            return 3 as number;
          case "FINANCE_MANAGER":
            return 4 as number;
          case "ENGINEER":
            return 5 as number;
          case "TECHNICIAN":
            return 5 as number;
          case "ASSISTANT_ENGINEER":
            return 5 as number;
          default:
            return 0 as number;
        }
      })(),
      divisionId: Number(itemData.empDetails.division),
      designation: itemData.empDetails.designation as
        | "MANAGER"
        | "DIVISION_HEAD"
        | "HR_MANAGER"
        | "FINANCE_MANAGER"
        | "ENGINEER"
        | "TECHNICIAN"
        | "ASSISTANT_ENGINEER",
      activeState: itemData.empDetails.activeState ? ("ACTIVE" as const) : ("INACTIVE" as const),
      name: itemData.empDetails.fullName,
      nameInitials: itemData.empDetails.nameWithInitials,
      email: itemData.empDetails.email,
      nic: itemData.empDetails.nic,
      address: itemData.empDetails.address,
      birthDate: itemData.empDetails.dob.toISOString(),
      joinDate: itemData.empDetails.joinDate.toISOString(),
      salaryBasic: convertToCents(itemData.empSalary.basic),
      salaryBudgeted: convertToCents(itemData.empSalary.budgetedAllowance),
      salaryWage: convertToCents(itemData.empSalary.wage),
      salaryAllowance: convertToCents(itemData.empSalary.allowance),
      salaryVehicleAllowance: convertToCents(itemData.empSalary.vehicleAllowance),
      salaryTravelAllowance: convertToCents(itemData.empSalary.travelAllowance),
      salaryOtPerHour: itemData.empSalary.overTime ? convertToCents(itemData.empSalary.salaryPerOtHour) : 0,
      salaryBata: itemData.empSalary.bata ? convertToCents(itemData.empSalary.salaryBata) : 0,
      salarayOutstationPerDay: itemData.empSalary.outstation ? convertToCents(itemData.empSalary.salaryOutstationPerDay) : 0,
      class: itemData.empDetails.class,
      entitledLeaveDaysAnnual: itemData.leaveEligibility.entitledLeaveDaysAnnual,
      entitledLeaveDaysCasual: itemData.leaveEligibility.entitledLeaveDaysCasual,
      entitledLeaveDaysMedical: itemData.leaveEligibility.entitledLeaveDaysMedical,
      percentageEpf8: itemData.empSalary.percentageEpf8,
      percentageEpf12: itemData.empSalary.percentageEpf12,
      percentageEtf: itemData.empSalary.percentageEtf,
    };
    StaffService.updateEmployee(values).then(async (response) => {
      if (response.isSuccess) {
        if (itemData.empDetails.empImg instanceof File) {
          // if (!imgPath) {
          await uploadImage(itemData.empDetails.empImg, response.data.id);
          // } else {
          //   await updateImage(itemData.empDetails.empImg, response.data.id);
          // }
        }
        openSuccessDialog("Success", `${itemData.empDetails.nameWithInitials} employee updated successfully`);
        setIsLoading(false);
        navigate("/staff/employee", { state: state });
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const uploadImage = async (image: File, userId: number): Promise<any> => {
    try {
      const response = await UploadService.replaceProfilePicture(image, userId);
      if (response) {
        return response?.data?.staticPath;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image", error);
      return null;
    }
  };

  // const updateImage = async (image: File, id: number): Promise<any> => {
  // try {
  //   const response = await UploadService.updateFile(image, id, "PHOTO");
  //   if (response) {
  //     return response?.data?.staticPath;
  //   }
  //   return null;
  // } catch (error) {
  //   console.error("Error uploading image", error);
  //   return null;
  // }
  // };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<PersonAddIcon />} headerTitle={Number(id) ? "Update Employee" : "Create Employee"} />
      </Grid>
      <Grid item xs={12}>
        <Formik
          enableReinitialize
          validateOnMount
          initialValues={initialItem}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values: CreateEmpInterface, { setSubmitting }) => {
            if (Number(id)) {
              updateUser(values, setSubmitting);
            } else {
              createUser(values, setSubmitting);
            }
          }}
        >
          {({ values, dirty, isSubmitting, isValid, resetForm, setFieldValue }) => (
            <Form>
              <Grid container spacing={1} justifyContent={"center"}>
                <Grid item xs={12} lg={4} md={4} sm={8}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <MainCard>
                        <ItemImageUpload
                          accept=".jpg,.png,.jpeg"
                          label="Upload Profile / Company Image"
                          maxFileSizeInBytes={IMAGE_SIZE}
                          name="empDetails.empImg"
                        />
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={8} md={8} sm={11}>
                  <Grid container>
                    <Grid item xs={12}>
                      <MainCard title="Personal Information">
                        <Grid container columnSpacing={gridSpacing}>
                          <Grid item xl={4} lg={4} xs={12} md={12}>
                            <TextField required label="Employee Number" name="empDetails.empNo" type="text" disabled={Number(id) > 0} />
                          </Grid>
                          <Grid item xl={4} xs={12} sm={6} lg={4} md={6}>
                            <Select label="Division *" name="empDetails.division" options={divisions} customHandleChange={() => {}} />
                          </Grid>
                          <Grid item xl={4} xs={12} sm={6} lg={4} md={6}>
                            <Select label="Class *" name="empDetails.designation" options={employeeTypes} customHandleChange={() => {}} />
                          </Grid>
                          <Grid item xl={12} lg={12} xs={12} md={12}>
                            <TextField required label="Designation" name="empDetails.class" type="text" />
                          </Grid>
                          <Grid item xl={12} lg={12} xs={12} md={12}>
                            <TextField required label="Name With Initials" name="empDetails.nameWithInitials" type="text" />
                          </Grid>
                          <Grid item xl={12} lg={12} xs={12} md={12}>
                            <TextField required label="Full Name" name="empDetails.fullName" type="text" />
                          </Grid>
                          <Grid item xl={4} xs={12} md={12}>
                            <TextField required label="NIC" name="empDetails.nic" type="text" />
                          </Grid>
                          <Grid item xl={4} xs={12} md={12} sm={6}>
                            <DateTimePicker required name="empDetails.dob" label={"DOB"} maxDate={dayjs()} />
                          </Grid>
                          <Grid item xl={4} xs={12} md={12} sm={6}>
                            <DateTimePicker required name="empDetails.joinDate" label={"Join Date"} maxDate={dayjs()} />
                          </Grid>
                          <Grid item xl={4} xs={12} sm={12} md={12}>
                            <TextField
                              required
                              label="Mobile"
                              name="empDetails.mobile"
                              type="tel"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CallIcon />
                                  </InputAdornment>
                                ),
                              }}
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                              }}
                            />
                          </Grid>
                          <Grid item xl={12} lg={12} xs={12} sm={12} md={12}>
                            <TextField
                              required
                              label="Address"
                              name="empDetails.address"
                              type="text"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <HomeIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xl={8} xs={12} md={12}>
                            <TextField
                              required
                              label="Email"
                              name="empDetails.email"
                              type="text"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AttachEmailIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xl={4} lg={4}>
                            <SwitchWrapper
                              name="empDetails.activeState"
                              label={values.empDetails.activeState ? "ACTIVE" : "INACTIVE"}
                              style={{ co: "green" }}
                            />
                          </Grid>
                        </Grid>
                        {Number(id) === 0 && (
                          <>
                            <Divider sx={{ my: 2 }} textAlign="left">
                              <Typography fontWeight={"bold"} variant="caption">
                                Login Credentilas
                              </Typography>
                            </Divider>
                            <Grid container columnSpacing={gridSpacing}>
                              <Grid item xl={4} lg={6} md={12} sm={12} xs={12}>
                                <TextField
                                  type={passwordShow.showPassword ? "text" : "password"}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                          {passwordShow.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                  name="empDetails.password"
                                  label="Password"
                                  placeholder="Password"
                                  required
                                />
                              </Grid>
                              <Grid item xl={4} lg={6} md={12} sm={12} xs={12}>
                                <TextField
                                  type={passwordShow.showConfirmPassword ? "text" : "password"}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockIcon />
                                      </InputAdornment>
                                    ),
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} edge="end">
                                          {passwordShow.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                  name="empDetails.confirmPassword"
                                  label="Confirm Password"
                                  placeholder="Confirm Password"
                                  required
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </MainCard>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ mt: 1 }}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "#ffff" }} />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          <Typography fontWeight={"bold"} variant="h4" color={"#ffff"}>
                            Salary Details
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1}>
                            <Grid item xs={12} container>
                              <Grid item xl={3} lg={3} md={4} sm={4} xs={5}>
                                <CheckboxWrapper name="empSalary.overTime" legend="Overtime" customHandleChange={() => {}} />
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  label="Salary per OT hour"
                                  name="empSalary.salaryPerOtHour"
                                  type="number"
                                  disabled={!values.empSalary.overTime}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                              <Grid item xl={3} lg={3} md={4} sm={4} xs={5}>
                                <CheckboxWrapper name="empSalary.bata" legend="Bata" customHandleChange={() => {}} />
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField required label="Salary Bata" name="empSalary.salaryBata" type="number" disabled={!values.empSalary.bata} />
                              </Grid>
                            </Grid>
                            <Grid item xs={12} container>
                              <Grid item xl={3} lg={3} md={4} sm={4} xs={5}>
                                <CheckboxWrapper name="empSalary.outstation" legend="Outstation" customHandleChange={() => {}} />
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  label="Salary outstation per day"
                                  name="empSalary.salaryOutstationPerDay"
                                  type="number"
                                  disabled={!values.empSalary.outstation}
                                />
                              </Grid>
                            </Grid>
                            <Grid item sm={4} xs={12}>
                              <TextField
                                required
                                label="EPF(8%)"
                                name="empSalary.percentageEpf8"
                                type="number"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item sm={4} xs={12}>
                              <TextField
                                required
                                label="EPF (12%)"
                                name="empSalary.percentageEpf12"
                                type="number"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item sm={4} xs={12}>
                              <TextField
                                required
                                label="ETF"
                                name="empSalary.percentageEtf"
                                type="number"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Basic Salary</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  name="empSalary.basic"
                                  type="number"
                                  variant="standard"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.consoleBasic", Number(values.empSalary.budgetedAllowance) + Number(e.target.value));
                                    setFieldValue("empSalary.basic", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.wage) +
                                        Number(values.empSalary.allowance) +
                                        Number(values.empSalary.vehicleAllowance) +
                                        Number(values.empSalary.travelAllowance) +
                                        Number(values.empSalary.budgetedAllowance) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Budgeted Allowance</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  variant="standard"
                                  name="empSalary.budgetedAllowance"
                                  type="number"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.consoleBasic", Number(values.empSalary.basic) + Number(e.target.value));
                                    setFieldValue("empSalary.budgetedAllowance", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.wage) +
                                        Number(values.empSalary.allowance) +
                                        Number(values.empSalary.vehicleAllowance) +
                                        Number(values.empSalary.travelAllowance) +
                                        Number(values.empSalary.basic) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Console Basic Salary</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField required variant="standard" name="empSalary.consoleBasic" type="number" disabled />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Wage Salary</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  name="empSalary.wage"
                                  type="number"
                                  variant="standard"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.wage", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.basic) +
                                        Number(values.empSalary.allowance) +
                                        Number(values.empSalary.vehicleAllowance) +
                                        Number(values.empSalary.travelAllowance) +
                                        Number(values.empSalary.budgetedAllowance) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Allowance</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  name="empSalary.allowance"
                                  type="number"
                                  variant="standard"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.allowance", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.basic) +
                                        Number(values.empSalary.wage) +
                                        Number(values.empSalary.vehicleAllowance) +
                                        Number(values.empSalary.travelAllowance) +
                                        Number(values.empSalary.budgetedAllowance) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Vehicle Allowance</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  name="empSalary.vehicleAllowance"
                                  type="number"
                                  variant="standard"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.vehicleAllowance", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.basic) +
                                        Number(values.empSalary.budgetedAllowance) +
                                        Number(values.empSalary.wage) +
                                        Number(values.empSalary.allowance) +
                                        Number(values.empSalary.travelAllowance) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Travel Allowance</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField
                                  required
                                  name="empSalary.travelAllowance"
                                  type="number"
                                  variant="standard"
                                  onChange={(e) => {
                                    setFieldValue("empSalary.travelAllowance", e.target.value);
                                    setFieldValue(
                                      "empSalary.grossSalary",
                                      Number(values.empSalary.basic) +
                                        Number(values.empSalary.budgetedAllowance) +
                                        Number(values.empSalary.wage) +
                                        Number(values.empSalary.allowance) +
                                        Number(values.empSalary.vehicleAllowance) +
                                        Number(e.target.value)
                                    );
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item xl={12} xs={12} md={12} container direction={"row"} spacing={1} justifyContent={"flex-end"}>
                              <Grid item lg={3} md={4} sm={4} xs={5}>
                                <Typography>Gross Salary</Typography>
                              </Grid>
                              <Grid item sm={6} xs={7}>
                                <TextField required name="empSalary.grossSalary" type="text" variant="standard" disabled />
                              </Grid>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ mt: 1 }}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "#ffff" }} />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          <Typography fontWeight={"bold"} variant="h4" color={"#ffff"}>
                            Leave Eligibility
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <LeaveEligibility />
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid
                    item
                    xs={12}
                    gap={1}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      py: 2,
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      size="medium"
                      sx={{ ...theme.typography.button }}
                      onClick={() =>
                        openConfirmDialog("Reset Form", `Are you sure you want to reset form?`, {}, () => {
                          closeConfirmDialog();
                          resetForm();
                        })
                      }
                    >
                      Clear
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      sx={{ ...theme.typography.button }}
                      size="medium"
                      disabled={!(values.empDetails.empImg !== initialItem.empDetails.empImg || dirty) || isSubmitting || !isValid}
                      startIcon={
                        isLoading && (
                          <CircularProgress
                            size={"20px"}
                            sx={{
                              mr: 1,
                              color: "gray",
                            }}
                          />
                        )
                      }
                    >
                      {Number(id) ? "Update" : "Create"} User
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default CreateEmployee;
