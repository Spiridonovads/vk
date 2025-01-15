import React, { useEffect, useState, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { observer } from "mobx-react-lite";
import { InfiniteScroll } from "../InfiniteScroll/InfiniteScroll";
import { DropdownList } from "../DroprdownList/DropdownList";
import appStore from "../../configs/store/AppStore/AppStore";
import { SelectChangeEvent } from "@mui/material/Select";
import toast from "react-hot-toast";
import { Container, Typography } from "@mui/material";
import { reaction } from "mobx";

export const App = observer(() => {
  const [filterState, setFilterState] = useState<string>("stars");
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

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
    if (isFirstRender) {
      sortNotify();
      setIsFirstRender(false);
    }
    setIsFirstRender(true);
  }, [isFirstRender]);

  const handleAppOptionChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value !== filterState) {
      setFilterState(event.target.value);
      appStore.fetchData(event.target.value);
    }
  };

  const errorNotify = () => {
    toast("Server connection error:(");
  };

  useEffect(() => {
    const disposer = reaction(
      () => appStore.error,
      (error) => {
        if (error) {
          setError(true);
        }
      }
    );
    return () => {
      disposer();
    };
  }, []);

  useEffect(() => {
    if (error) {
      errorNotify();
      setError(false);
    }
  }, [error]);

  function sortNotify() {
    toast(
      "Be careful! \n Changes to the sorting will reset all previously saved data"
    );
  }

  return (
    <>
      <Toaster />
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
        <InfiniteScroll
          items={appStore.items}
          hasMore={appStore.hasMore}
          loadMore={fetchMoreData}
          loading={appStore.loading}
        />
      </Container>
    </>
  );
});
