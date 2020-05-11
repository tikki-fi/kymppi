import React from "react";

import Activity from "./Activity";
import {Container} from "react-bootstrap";

const Activities = (props) => {

  return (
      <Container>
        {props.activities.map(activity => (
            <Activity
              key={activity.id}
              id={activity.id}
              eventDate={activity.eventDate}
              series={activity.series}
              caliber={activity.caliber}
              supervised={activity.supervised}
              qualified={activity.qualified}
              subTasks={activity.subTasks}
              activities={props.activities}
              setActivities={props.setActivities}
              deleteActivity={props.deleteActivity}
              updateActivity={props.updateActivity}
            />
        ))}
      </Container>
  );
};

export default Activities;
