import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import style from "./Card.module.css";
import { Grid, ListItem, ListItemText } from "@mui/material";
import appStore from "../../configs/store/AppStore/AppStore";

export interface CardProps {
  login: string;
  avatar_url: string;
  name: string;
}

export const Card: React.FC<CardProps> = observer(
  ({ login, avatar_url, name }) => {
    const [score, setScore] = useState<number>(0);
    const [edit, setEdit] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const scoreClass = classNames({
      [style.bad]: score >= 0 && score <= 1,
      [style.normal]: score > 1 && score <= 3,
      [style.good]: score > 3 && score <= 5,
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setEdit(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    function onHideClick(): void {
      appStore.removeItem(login);
    }

    function onEditClick(): void {
      setEdit(!edit);
    }

    const onScoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseInt(event.target.value);
      setScore(value);
    };

    return (
      <Grid item xs={12} md={6} lg={4}>
        <ListItem
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <figure className={style.card}>
            {" "}
            <img
              src={avatar_url}
              alt={`Avatar of ${login}`}
              className={style.img}
            />
            <figcaption className={style.truncate}>
              <ListItemText primary={name} />
              <button className={style.button} onClick={onHideClick}>
                hide
              </button>
            </figcaption>
            <figcaption className={style.truncate}>
              <div>
                Score: <span className={scoreClass}>{score}</span>
              </div>
              <button
                className={`${style.button} ${edit && style.buttonActive}`}
                onClick={onEditClick}
              >
                edit
              </button>
            </figcaption>
            {edit && (
              <form className={style.editForm}>
                <legend>select a rating: </legend>
                <div ref={selectRef}>
                  <select onChange={onScoreChange} value={score}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </form>
            )}
          </figure>
        </ListItem>
      </Grid>
    );
  }
);
