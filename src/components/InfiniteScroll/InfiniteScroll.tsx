import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useOnScreen } from "../../hooks/useOnScreen";
import { Card } from "../Card/Card";
import appStore from "../../configs/store/AppStore/AppStore";
import { Grid, Typography } from "@mui/material";

interface InfiniteScrollProps {
  hasMore: boolean;
  loadMore: () => void;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = observer(
  ({ hasMore, loadMore }) => {
    const { measureRef, isIntersecting, observer } = useOnScreen();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        if (observer) observer.disconnect();

        loadMore();
        setIsLoading(false);
      }
    }, [isIntersecting, hasMore, loadMore, isLoading]);

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
  }
);
