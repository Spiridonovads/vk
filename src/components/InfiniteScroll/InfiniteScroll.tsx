import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useOnScreen } from "../../hooks/useOnScreen";
import { Card } from "../Card/Card";
import appStore from "../../configs/store/AppStore/AppStore";
import { Grid, Typography } from "@mui/material";
import { Item } from "../../configs/store/AppStore/СreateAppStore";

interface InfiniteScrollProps {
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
  items: Item[];
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = observer(
  ({ hasMore, loadMore, loading, items }) => {
    const { measureRef, isIntersecting, observer } = useOnScreen();

    useEffect(() => {
      if (isIntersecting && hasMore && !loading) {
        if (observer) observer.disconnect();

        loadMore();
      }
    }, [isIntersecting, hasMore, loadMore, loading]);

    return (
      items && (
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
          {loading && (
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", margin: "0 auto" }}
            >
              Loading...
            </Typography>
          )}
        </Grid>
      )
    );
  }
);
