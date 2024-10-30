import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { InfiniteScroll } from "../InfiniteScroll/InfiniteScroll";
import { DropdownList } from "../DroprdownList/DropdownList";
import appStore from "../../configs/store/AppStore/AppStore";
import { SelectChangeEvent } from "@mui/material/Select";

import { Container, Typography } from "@mui/material";

export const App = observer(() => {
  const [filterState, setFilterState] = useState<string>("stars");

  const appFormRef = useRef<HTMLDivElement>(null);

  const options = ["stars", "forks", "updated"];
  const optionsContent = [
    "Number of stars",
    "Number of forks",
    "Number of updated",
  ];

  const fetchMoreData = () => {
    if (!appStore.hasMore) return;
    appStore.fetchData();
  };

  useEffect(() => {
    appStore.fetchData();
  }, []);

  const handleAppOptionChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value !== filterState) {
      setFilterState(event.target.value);
      appStore.fetchData(event.target.value);
    }
  };

  return (
    <>
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
        <DropdownList
          options={options}
          optionsContent={optionsContent}
          id="filter-select-label"
          label="Filters"
          ref={appFormRef}
          value={filterState}
          setValue={handleAppOptionChange}
        />
        {appStore.items && (
          <InfiniteScroll
            hasMore={appStore.hasMore}
            isLoading={appStore.loading}
            loadMore={fetchMoreData}
          />
        )}
      </Container>
      {appStore.error && (
        <>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            {appStore.error}
          </Typography>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", marginTop: "20px" }}
          >
            please reload the page
          </Typography>
        </>
      )}
    </>
  );
});
