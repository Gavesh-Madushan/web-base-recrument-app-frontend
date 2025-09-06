import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery } from "@tanstack/react-query";
import { getLeaveRequest } from "../../../assets/api";
import dayjs from "dayjs";

export default function ExportLeaveSubmission({
  id,
}: Readonly<{ id: number }>) {
  const [loading, setLoading] = useState(false);

  const leave: any = useQuery({
    queryKey: ["leaveRequests/:id", id],
    queryFn: () => getLeaveRequest(id),
    enabled: true,
    select: (res) => res.data,
  });

  const handleDownloadExcel = async () => {
    setLoading(true);

    try {
      // 1️⃣ Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Leave Form");

      const isOneDayPeriod = leave?.data?.period === "ONE_DAY" ? -1 : -0.5;

      // 2️⃣ Define structured data
      const data = [
        ["Leave Form"], // Title
        ["Description", leave?.data?.description],
        ["Name with Initial", leave?.data?.user?.nameInitials],
        ["Employee No", leave?.data?.user?.employeeNumber],
        ["Division", leave?.data?.division?.name],
        [],
        ["Date", "Period", "Type"],
        [
          dayjs(
            `${leave?.data?.year}-${leave?.data?.month}-${leave?.data?.day}`
          ).format("D/MMM/YY"),
          leave?.data?.period,
          leave?.data?.type,
        ],
        [],
        ["Reason", leave?.data?.reason],
        [],
        ["Description", "Annual", "Medical", "Casual", "Total"],
        [
          "Leave Eligible",
          leave?.data?.user?.entitledLeaveDaysAnnual,
          leave?.data?.user?.entitledLeaveDaysMedical,
          leave?.data?.user?.entitledLeaveDaysCasual,
          0,
        ],
        [
          "Utilized",
          leave?.data?.type == "ANNUAL" ? isOneDayPeriod : 0,
          leave?.data?.type == "MEDICAL" ? isOneDayPeriod : 0,
          leave?.data?.type == "CASUAL" ? isOneDayPeriod : 0,
          0,
        ],
        [
          "Balance",
          leave?.data?.user?.remainingLeaveDaysAnnual,
          leave?.data?.user?.remainingLeaveDaysMedical,
          leave?.data?.user?.remainingLeaveDaysCasual,
          0,
        ],
        [],
        ["Approved by", leave?.data?.approvedBy?.nameInitials],
        [],
        ["Comments", leave?.data?.comment],
      ];

      // 3️⃣ Insert data into worksheet
      data.forEach((row, index) => {
        worksheet.addRow(row);
      });

      // 4️⃣ Apply Styles (Bold, Merging, Borders)
      worksheet.mergeCells("A1:E1"); // Merge Title "Leave Form"
      worksheet.getCell("A1").font = { bold: true, size: 14 }; // Bold title

      // Bold section headers
      [
        "A2",
        "A7",
        "B7",
        "C7",
        "A10",
        "A12",
        "B12",
        "C12",
        "D12",
        "E12",
      ].forEach((cell) => {
        worksheet.getCell(cell).font = { bold: true };
      });

      // Function to apply borders
      const applyBorder = (cellRange: string) => {
        const range = worksheet.getCell(cellRange);
        range.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      };

      // 5️⃣ Apply Borders to Specific Ranges
      for (let row = 7; row <= 8; row++) {
        for (let col of ["A", "B", "C"]) {
          applyBorder(`${col}${row}`);
        }
      }

      for (let row = 12; row <= 15; row++) {
        for (let col of ["A", "B", "C", "D", "E"]) {
          applyBorder(`${col}${row}`);
        }
      }

      // 6️⃣ Set column widths
      worksheet.columns = [
        { width: 20 },
        { width: 25 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
      ];

      // Compute sum and set in E13, E14, E15
      sumRangeAndSet(worksheet, "B", "D", 13, "E");
      sumRangeAndSet(worksheet, "B", "D", 14, "E");
      sumRangeAndSet(worksheet, "B", "D", 15, "E");

      // 7️⃣ Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Leave_Form.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="primary"
      variant="outlined"
      startIcon={
        loading ? (
          <CircularProgress color="inherit" sx={{ mr: 1 }} size={20} />
        ) : (
          <DownloadIcon />
        )
      }
      onClick={handleDownloadExcel}
    >
      <b>Export</b>
    </Button>
  );
}

const sumRangeAndSet = (worksheet, startCol, endCol, row, targetCol) => {
  let sum = 0;
  for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
    const cellValue = worksheet.getCell(
      `${String.fromCharCode(col)}${row}`
    ).value;
    sum += Number(cellValue) || 0; // Ensure numeric addition
  }
  worksheet.getCell(`${targetCol}${row}`).value = sum; // Set sum in target column
};
