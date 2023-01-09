// Material
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { Dayjs } from "dayjs";
import Grid from "@mui/material/Grid";
import { StyledEngineProvider } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
// Material

// Tiemeline
import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TodayMarker,
  OnItemDragObjectMove,
  OnItemDragObjectResize,
} from "react-calendar-timeline"; // make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
// Timeline

import moment, { Moment } from "moment";
import { useState, useEffect } from "react";
import { items as it, groups as gp } from "../custom-data";
export const defaultTimeStart = moment().startOf("hour").add(-1, "hour");
export const defaultTimeEnd = moment().startOf("hour").add(2, "hour");

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    innerHeight: "10px",
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const TimelineComponent = () => {
  const [hour, setHour] = useState<any>({
    second: 1,
    minute: 30,
    hour: 3,
    day: 1,
    month: 1,
    year: 1,
  });

  const twoSeconds = 2000;
  useEffect(() => {
    console.log("Message or count changed");
  }, [hour]);

  const [items, setItems] = useState<any[]>(it);

  const [groups, setGroups] = useState(gp);

  const [selectedTimeView, setSelectedTimeView] = useState("24h");
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [selectedTypeView, setSelectedTypeView] = useState("day");
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null);
  const [snack, SetSnack] = useState<any>({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
    message: 'asds asd asd'
  });

  const { vertical, horizontal, open } = snack;

  const handleItemMove = (
    itemId: number,
    dragTime: number,
    newGroupOrder: number
  ) => {
    const group = groups[newGroupOrder];

    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            start_time: moment(dragTime),
            end_time: moment(dragTime + (item.end_time - item.start_time)),
            group: group.id,
          }
        : item
    );
    setItems(updatedItems);
  };

  const handleItemResize = (itemId: number, time: number, edge: any) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            start_time:
              edge === "left" ? moment(time) : moment(item.start_time),
            end_time: edge === "left" ? moment(item.end_time) : moment(time),
          }
        : item
    );
    setItems(updatedItems);
  };

  const groupRenderer = ({ group }: any) => {
    return (
      <div className="custom-group">
        <span className="group-dot">{group.title}</span>
      </div>
    );
  };

  const isNow = (item: any) => {
    return item.start_time < new Date() && item.end_time > new Date();
  };

  const itemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }: any) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    return (
        <div {...getItemProps(item.itemProps)}>
          {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ""}
          <Tooltip title={`${itemContext.title}, ${item.start_time.format("h:mm a")} - ${item.end_time.format("h:mm a")}`} arrow>

          <div
            className={isNow(item) ? "item-container" : "item-container-out"}
            style={{ maxHeight: `${itemContext.dimensions.height}` }}
          >
            {isNow(item) ? (
              <div className="image-container">
                <img className="item-image" src={item.image} alt="" />
              </div>
            ) : (
              <div style={{ width: "15px" }}></div>
            )}
            <div className="custom-title-section">
              <p className="title">{itemContext.title}</p>
              <p className="title-time">
                {item.start_time.format("h:mm a")}
                {" - "}
                {item.end_time.format("h:mm a")}
              </p>
            </div>
          </div>
          </Tooltip>

          {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ""}
        </div>
    );
  };

  const setHour24 = () => {
    const newTimeLineConfig = {
      second: 1,
      minute: 1,
      hour: 1,
      day: 1,
      month: 1,
      year: 1,
    };
    setHour(newTimeLineConfig);
  };
  
  const setHour3 = () => {
    const newTimeLineConfig = {
      second: 1,
      minute: 1,
      hour: 1,
      day: 1,
      month: 1,
      year: 1,
    };
    setHour(newTimeLineConfig);
  };

  const handleClickSearchChannel = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value as string);
  };

  const handleSelectedTimeView = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    setSelectedTimeView(value);
  };

  const handleSelectedTypeView = (
    event: React.MouseEvent<HTMLElement>,
    value: string
  ) => {
    setSelectedTypeView(value);
  };

  const handleOpenSnack = (newState: SnackbarOrigin) => () => {
    SetSnack({ open: true, message: 'wasd', ...newState});
  };

  const handleCloseSnack = () => {
    SetSnack({ ...snack, open: false });
  };

  const handleItemChange = (itemDragObject: OnItemDragObjectMove | OnItemDragObjectResize) => {
    handleOpenSnack({
      vertical: 'bottom',
      horizontal: 'center',
    });
    console.log(itemDragObject)
  }

  return (
    <div style={{ borderRadius: "20px" }}>
      <StyledEngineProvider injectFirst>
        <Box
          sx={{ flexGrow: 1 }}
          style={{
            backgroundColor: "#fff",
            paddingRight: "5px",
            paddingBottom: "5px",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" size="small">
                  Select channel
                </InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedGroup}
                  label="Select channel"
                  onChange={handleClickSearchChannel}
                >
                  {groups.map((elemento) => (
                    <MenuItem key={elemento.title} value={elemento.title}>
                      {elemento.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={selectedTimeView}
                    exclusive
                    onChange={handleSelectedTimeView}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="24h" aria-label="left aligned">
                      1 H
                    </ToggleButton>
                    <ToggleButton value="30min" aria-label="right aligned">
                      30 min
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item>
                  <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={selectedTypeView}
                    exclusive
                    onChange={handleSelectedTypeView}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="day" aria-label="left aligned">
                      Day
                    </ToggleButton>
                    <ToggleButton value="week" aria-label="right aligned">
                      Week
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select day"
                  componentsProps={{
                    actionBar: { actions: ["today"] },
                  }}
                  value={selectedDay}
                  onChange={(newValue) => {
                    setSelectedDay(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>

        <Timeline
          groups={[...groups]}
          items={[...items]}
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.75}
          canChangeGroup={false}
          canMove
          canResize={"both"}
          defaultTimeStart={defaultTimeStart.toDate()}
          defaultTimeEnd={defaultTimeEnd.toDate()}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          onItemDrag={handleItemChange}
          itemRenderer={itemRenderer}
          groupRenderer={groupRenderer}
          dragSnap={1 * 60 * 1000}
          timeSteps={hour}
          lineHeight={50}
        >
          <TimelineMarkers>
            <TodayMarker date={new Date()} interval={twoSeconds}>
              {({ styles }) => (
                <div
                  style={{
                    ...styles,
                    backgroundColor: "black",
                    width: "3px",
                    zIndex: 100,
                  }}
                />
              )}
            </TodayMarker>
          </TimelineMarkers>
          <TimelineHeaders>
            <SidebarHeader variant={"left"}>
              {({ getRootProps }) => {
                return (
                  <div className="header-group" {...getRootProps()}>
                    Channels
                  </div>
                );
              }}
            </SidebarHeader>
            <SidebarHeader variant={"right"}>
              {({ getRootProps, data }) => {
                return (
                  <div className="header-group" {...getRootProps()}>
                    {data}
                  </div>
                );
              }}
            </SidebarHeader>
            <DateHeader
              style={{ backgroundColor: "#cbd5e0", border: "0px" }}
              unit="primaryHeader"
            />
            <DateHeader />
          </TimelineHeaders>
        </Timeline>
      </StyledEngineProvider>
      <Snackbar
        anchorOrigin={{ vertical, horizontal}}
        open={open}
        onClose={handleCloseSnack}
        message={snack.message}
      />
    </div>
  );
};
export default TimelineComponent;
