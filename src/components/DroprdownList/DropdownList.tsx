import * as React from "react";
import { forwardRef } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import style from "./style.module.css";

export interface DropdownListProps {
  options: string[];
  optionsContent: string[];
  id: string;
  label: string;
  value: string;
  setValue: (event: SelectChangeEvent<string>) => void;
}

export const DropdownList = forwardRef<HTMLDivElement, DropdownListProps>(
  ({ options, optionsContent, id, label, value, setValue }, ref) => {
    return (
      <div ref={ref} className={style.wrapper}>
        <form className={style.miltiForm} style={{ marginTop: "5px" }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select
              labelId={id}
              value={value}
              onChange={setValue}
              label={label}
            >
              {options.map((option, i) => (
                <MenuItem value={option} key={i}>
                  {optionsContent[i]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </div>
    );
  }
);
