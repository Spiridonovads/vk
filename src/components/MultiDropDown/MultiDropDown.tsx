import * as React from "react";
import { useState, useRef } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import appStore from "../../configs/store/AppStore/AppStore";
import { SelectChangeEvent } from "@mui/material/Select";
import style from "./style.module.css";

const MultiDropdown: React.FC = () => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");

  const onChange = (event: SelectChangeEvent<string>) => {
    const res = event.target.value;
    if (res !== value) {
      setValue(res);
      appStore.fetchData(res);
    }
  };

  return (
    <div ref={selectRef} className={style.wrapper}>
      <form className={style.miltiForm}>
        <legend>Filters:</legend>
        <FormControl fullWidth>
          <InputLabel id="filter-select-label">Filters</InputLabel>
          <Select
            labelId="filter-select-label"
            value={value}
            onChange={onChange}
            label="Filters"
          >
            <MenuItem value="stars">Number of stars</MenuItem>
            <MenuItem value="forks">Number of forks</MenuItem>
            <MenuItem value="updated">Number of updated</MenuItem>
          </Select>
        </FormControl>
      </form>
    </div>
  );
};

export default MultiDropdown;
