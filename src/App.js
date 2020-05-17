import NavBar from "./components/NavBar";
import Activities from "./components/Activities"

import React, { useEffect, useState } from "react";
import { useAuth0 } from "./react-auth0-spa";
import { Container } from "react-bootstrap";
import axios from "axios";

function App() {
  const {loading} = useAuth0();
  const [activities, setActivities] = React.useState([]);
  const { isAuthenticated, getTokenSilently, user } = useAuth0();
  const [jwt, setJwt] = useState();

  const getHostname = () => {
    const hostname = window.location.hostname;
    if (hostname === 'tikki.fi') {
      return 'https://tikki.fi';
    }
    if (hostname === 'localhost' || hostname === 'dev.tikki.fi') {
      return 'https://dev.tikki.fi';
    }
    if (hostname === 'qa.tikki.fi') {
      return 'https://qa.tikki.fi';
    }
    if (hostname === '127.0.0.1' ) {
      return 'http://localhost:8080';
    }
    throw Error('Unsupported hostname: ' + hostname)
  }

  const updateActivities = () => {
    axios.get(
      getHostname() + '/api/record',
      {
        params: { user_id: user.sub, type_id: 1337 },
        headers: { Authorization: `Bearer ${jwt}` }
      },
    ).then(response => {
      clearActivities();
      for (let i = 0; i < response.data.result.length; i++){
        const obj = response.data.result[i];
        let activity = obj.payload;
        console.log(activity.eventDate);
        activity.id = obj.id;
        appendActivity(activity);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const clearActivities = () => {
    setActivities(() => []);
  }

  useEffect(() => {
    if (jwt !== undefined) {
      updateActivities();
    }
  }, [jwt])

  const updateToken = async () => {
    if (jwt === undefined) {
      const accessToken = await getTokenSilently();
      axios.post(
        getHostname() + '/api/login',
        {token: accessToken},
      )
        .then(response => {
          setJwt(response.data.result.jwt);
        })
    }
  };

  const createActivity = activity => {
    axios.post(
      getHostname() + '/api/record',
      {
        type_id: 1337,
        payload: activity,
      },
      {headers: { Authorization: `Bearer ${jwt}` }}
    ).then(response => {
      activity.id = response.data.result.id;
      appendActivity(activity);
    }).catch(error => {
      console.log(error);
    })
  }

  const deleteActivity = activityId => {
    axios.delete(
      getHostname() + '/api/record',
      {
        params: { id: activityId },
        headers: { Authorization: `Bearer ${jwt}` }
      }
    ).then(() => {
      updateActivities();
    }).catch(error => {
      console.log(error);
    })
  }

  const updateActivity = activity => {
    const data = {
      id: activity.id,
      type_id: 1337,
      payload: activity,
    }
    console.log(data);
    axios.put(
      getHostname() + '/api/record',
      data,
      {headers: { Authorization: `Bearer ${jwt}` }}
    ).then(() => {
      updateActivities();
    }).catch(error => {
      console.log(error);
    })
  }


  if (isAuthenticated) {
    updateToken();
  }

  const appendActivity = activity => {
    setActivities(prevState => prevState.concat(activity));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="App">
        <NavBar
          appendActivity={appendActivity}
          createActivity={createActivity}
          updateActivities={updateActivities}
        />
        <Container>
          <Activities
              activities={activities}
              appendActivity={appendActivity}
              updateActivities={updateActivities}
              setActivities={setActivities}
              deleteActivity={deleteActivity}
              updateActivity={updateActivity}
          />
        </Container>
      </div>
  );
}

export default App;
