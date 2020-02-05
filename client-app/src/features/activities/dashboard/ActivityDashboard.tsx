import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";

// React.FC means create a functional component
const ActivityDashboard: React.FC = () => {

  // Get access to the root store, and then the activity store
  const rootStore = useContext(RootStoreContext);
  // These are the two methods that will be used in this component from the activityStore
  const {loadActivities, loadingInitial} = rootStore.activityStore;

  // useEffect essentially combines the three lifestyle methods.
  useEffect(() => {
    // When the component mounts, call the loadActivities function from the activity store, destructured from the root store
    loadActivities();
    // Need to add the method in square brackets after callback so that it doesn't keep calling itself over and over agin. 
    //Including the dependancies means it will only update if the dependancy changes. 
  }, [loadActivities]);

  // loadingInitial is set to true when the function call starts, and turned false when data is received  
  if (loadingInitial)
    return <LoadingComponent content="Loading activities..." />;

    // Here, return the main page with activityList component
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>

      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
