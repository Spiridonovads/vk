import React, { useEffect } from "react";
import { useOnScreen } from "../../hooks/useOnScreen";
import { Card } from "../Card/Card";
import appStore from "../../configs/store/AppStore/AppStore";
import { Grid, Typography } from "@mui/material";

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  isLoading,
  loadMore,
}) => {
  const { measureRef, isIntersecting, observer } = useOnScreen();

  useEffect(() => {
    if (isIntersecting && hasMore) {
      loadMore();
      observer?.disconnect();
    }
  }, [isIntersecting, hasMore, loadMore]);

  return (
    <Grid container spacing={1}>
      {appStore.items.map((item, i: number) => {
        if (i === appStore.items.length - 1) {
          return (
            <Card
              mesureRef={measureRef}
              key={i}
              login={item.owner.login}
              avatar_url={item.owner.avatar_url}
              name={item.name}
              id={item.id}
              link={item.html_url}
            />
          );
        }
        return (
          <Card
            key={i}
            login={item.owner.login}
            avatar_url={item.owner.avatar_url}
            name={item.name}
            id={item.id}
            link={item.html_url}
          />
        );
      })}
      {isLoading && (
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", margin: "0 auto" }}
        >
          Loading...
        </Typography>
      )}
    </Grid>
  );
};
