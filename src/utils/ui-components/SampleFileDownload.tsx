import { Button, Grid } from "@mui/material";

const SampleFileDowload = ({ fileType }: any) => {
  //file type 1 for number file download, 2 for template message for personalize campaign file download
  const handleDownload = (url: any, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container spacing={1} my={2}>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => {
            if (fileType === 1) {
              handleDownload(
                "../../assets/sample_files/sample_for_number_file.xlsx",
                "sample_for_number_file.xlsx"
              );
            } else if (fileType === 2) {
              handleDownload(
                "../../assets/sample_files/sample_for_templated_message.xlsx",
                "sample_for_templated_message.xlsx"
              );
            }
          }}
          // href={require('../../assets/sample_files/sample_for_number_file.xlsx')}
          startIcon={
            <img
              src={
                "https://dsuabgmmtxmj1.cloudfront.net/common/excel_icon2.png"
              }
              width={"40"}
              alt=""
            />
          }
        >
          Sample Excel
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          onClick={() => {
            if (fileType === 1) {
              handleDownload(
                "../../assets/sample_files/sample_for_number_file.csv",
                "sample_for_number_file.csv"
              );
            } else if (fileType === 2) {
              handleDownload(
                "../../assets/sample_files/sample_for_templated_message.csv",
                "sample_for_templated_message.csv"
              );
            }
          }}
          // href={require('../../assets/sample_files/sample_for_number_file.csv')}
          startIcon={
            <img
              src={"https://cdn-icons-png.flaticon.com/128/8242/8242984.png"}
              width={"40"}
              alt=""
            />
          }
        >
          Sample CSV
        </Button>
      </Grid>
    </Grid>
  );
};

export default SampleFileDowload;
