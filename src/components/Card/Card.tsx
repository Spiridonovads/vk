import React, { useState, useRef } from "react";
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
} from "@mui/material";
import appStore from "../../configs/store/AppStore/AppStore";
import { DropdownList } from "../DroprdownList/DropdownList";
import { SelectChangeEvent } from "@mui/material/Select";

export interface CardProps {
  login: string;
  avatar_url: string;
  name: string;
  id: number;
  link: string;
  mesureRef?: (node: HTMLElement | null) => void;
}

export const Card: React.FC<CardProps> = observer(
  ({ login, avatar_url, name, id, link, mesureRef }) => {
    const [editState, setEditState] = useState<boolean>(false);
    const [ratingState, setRatingState] = useState<string>("1");

    const cardFormRef = useRef<HTMLDivElement>(null);

    const options = ["1", "2", "3", "4", "5"];
    const optionsContent = ["1", "2", "3", "4", "5"];

    const RatingClass = classNames(`${style.bad}`, {
      [style.normal]: +ratingState > 1 && +ratingState <= 3,
      [style.good]: +ratingState > 3 && +ratingState <= 5,
    });

    const onHideClick = (): void => {
      appStore.removeItem(id);
    };

    const onEditClick = (): void => {
      setEditState(!editState);
    };

    const handleCardOptionChange = (event: SelectChangeEvent<string>) => {
      if (event.target.value !== ratingState) {
        setRatingState(event.target.value);
      }
    };

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} ref={mesureRef}>
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
            <Typography
              noWrap
              className={RatingClass}
              sx={{ textDecoration: "underline" }}
            >
              <a href={link} target="_blank" rel="noreferrer">
                link to the repo
              </a>
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={onHideClick}>
              Hide
            </Button>
            <Typography variant="body2" sx={{ mt: 1 }}>
              You appreciated:{" "}
              <span className={RatingClass}>{ratingState}</span>
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={onEditClick}>
              Edit
            </Button>
            {editState && (
              <DropdownList
                id="rating-select-label"
                options={options}
                optionsContent={optionsContent}
                label="Rating"
                value={ratingState}
                setValue={handleCardOptionChange}
                ref={cardFormRef}
              />
            )}
          </CardContent>
        </CardStyle>
      </Grid>
    );
  }
);
