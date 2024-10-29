import * as React from "react";
import { useState, useRef } from "react";
import style from "./style.module.css";
import appStore from "../../configs/store/AppStore/AppStore";

const MultiDropdown: React.FC = () => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
        <select onChange={onChange} value={value}>
          <option value="stars">Number of stars</option>
          <option value="forks">Number of forks</option>
          <option value="updated">Number of updated</option>
        </select>
      </form>
    </div>
  );
};

export default MultiDropdown;
