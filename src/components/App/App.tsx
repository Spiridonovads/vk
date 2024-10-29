import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "../Card/Card";
import MultiDropdown from "../MultiDropDown/MultiDropDown";
import appStore from "../../configs/store/AppStore/AppStore";

import { Container, Grid, Typography } from "@mui/material";

export const App = observer(() => {
  const fetchMoreData = () => {
    appStore.updatePagination();
    appStore.fetchData();
  };

  useEffect(() => {
    appStore.fetchData();
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", marginTop: "20px" }}
      >
        GitHub repositories
      </Typography>
      <MultiDropdown />
      <InfiniteScroll
        dataLength={appStore.items?.length}
        next={fetchMoreData}
        hasMore={appStore.hasMore}
        loader={
          <Typography variant="body1" sx={{ padding: "10px 0" }}>
            ...Loading
          </Typography>
        }
        style={{
          marginTop: "20px",
        }}
      >
        <Grid container spacing={1}>
          {appStore.items.map((item, i: number) => (
            <Card
              key={i}
              login={item.owner.login}
              avatar_url={item.owner.avatar_url}
              name={item.name}
            />
          ))}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
});
