import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityListItem from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {format} from 'date-fns';

// This component is implemented inside the ActivityDashboard

const ActivityList: React.FC = () => {

  // Get access to the rootStore, giving access to the activityStore
  const rootStore = useContext(RootStoreContext);

  // Destructured props: going to use the activitiesByDate method from the activityStore
  const { activitiesByDate } = rootStore.activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => ( // loop over each group to display date
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {format(group, 'eeee do MMMM')}
          </Label>
          <Item.Group divided>
            {activities.map(activity => ( // loop over each activity inside each date group to show activity
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);