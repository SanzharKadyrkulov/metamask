import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";

export interface ToggleButtonOption {
  label: string;
  value: string;
}

interface ToggleButtonsProps {
  selectedItem: string;
  options: ToggleButtonOption[];
  onChange: (option: string) => void;
}
export default function ToggleButtons({
  options,
  onChange,
  selectedItem,
}: ToggleButtonsProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    onChange(value);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        flexWrap: "wrap",
        background: "none",
      }}
    >
      <StyledToggleButtonGroup
        color="primary"
        value={selectedItem}
        exclusive
        size="small"
        onChange={handleChange}
        aria-label="Platform"
        sx={{ height: "40px" }}
      >
        {options.map((item) => (
          <ToggleButton key={item.value} value={item.value}>
            {item.label}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Paper>
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: "1px solid transparent",
    },
}));
