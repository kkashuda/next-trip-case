import { Box } from "@mui/material";

interface TabPanelProps {
  children?: any;
  dir?: string;
  index: number;
  value: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box sx={{ padding: 0 }}>
        <Box>{children}</Box>
      </Box>
    </div>
  );
}

export default TabPanel;
