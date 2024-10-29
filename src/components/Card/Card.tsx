import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import style from "./Card.module.css";
import {
  Grid,
  Card as CardStyle,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import appStore from "../../configs/store/AppStore/AppStore";
import { SelectChangeEvent } from "@mui/material/Select";

export interface CardProps {
  login: string;
  avatar_url: string;
  name: string;
}

export const Card: React.FC<CardProps> = observer(
  ({ login, avatar_url, name }) => {
    const [score, setScore] = useState<string>("1");
    const [edit, setEdit] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const scoreClass = classNames({
      [style.bad]: +score >= 0 && +score <= 1,
      [style.normal]: +score > 1 && +score <= 3,
      [style.good]: +score > 3 && +score <= 5,
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

    const onScoreChange = (event: SelectChangeEvent<string>) => {
      const value = parseInt(event.target.value);
      setScore(value.toString());
    };

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CardStyle
          sx={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "10px",
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={avatar_url}
            alt={`Avatar of ${login}`}
          />
          <CardContent>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={onHideClick}>
              Hide
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Score: <span className={scoreClass}>{score}</span>
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={onEditClick}>
              Edit
            </Button>
            {edit && (
              <form style={{ marginTop: "5px" }}>
                <legend>Select a rating:</legend>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="rating-select-label">Rating</InputLabel>
                  <Select
                    labelId="rating-select-label"
                    value={score}
                    onChange={onScoreChange}
                    label="Рейтинг"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
              </form>
            )}
          </CardContent>
        </CardStyle>
      </Grid>
    );
  }
);
