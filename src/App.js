import NavBar from "./components/NavBar";
import Activities from "./components/Activities"

import React, { useEffect, useState } from "react";
import { useAuth0 } from "./react-auth0-spa";
import { Container } from "react-bootstrap";
import axios from "axios";
import JsPDF from "jspdf";
import {formatDate, formatSubtask, parseDate} from './utils';
import logo from './logo.png';
import Col from "react-bootstrap/Col";

function App() {
  const [activities, setActivities] = React.useState([]);
  const { isAuthenticated, getTokenSilently, loading, user } = useAuth0();
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

  const exportPdf = () => {
    const doc = new JsPDF({ putOnlyUsedFonts: true, orientation: "portrait", unit: "pt" });
    const pageLength = 790;
    const size1 = 16;
    const size2 = 12;
    const size3 = 8;
    const paddingSize = 4;
    const spacingSize = 10;

    let horizontalOffset = 20;
    let verticalOffset = 30;
    let pageNumber = 0;
    const img = new Image();
    img.src = logo;

    const addPage = () => {
      if (pageNumber > 0) {
        doc.addPage();
      } else {
        pageNumber = 1;
      }
      doc.addImage(img, "PNG", 530, 20, 50, 50);
      doc.setFontSize(size2);
      doc.text(`Sivu: ${pageNumber}`, 290, pageLength + 20);
      doc.setFontSize(size3);
      doc.text(`Tulostettu ${formatDate(new Date(), 'fin')} Reserviläisurheiluliiton Kymppi-ampumapäiväkirjapalvelusta (${user.sub})`, 80, pageLength + 40)
    }

    addPage();

    const updateAndGetVerticalOffset = offset => {
      const newVerticalOffset = (verticalOffset + offset)
      // increment page if vertical offset exceeds page length
      if (newVerticalOffset > pageLength) {
        pageNumber += 1;
        addPage();
        verticalOffset = 0;
      }
      return newVerticalOffset;
    }

    doc.setFontSize(size1);
    doc.text(`Henkilö: ${user.name}`, horizontalOffset, verticalOffset);
    verticalOffset = updateAndGetVerticalOffset(size2 + paddingSize);
    doc.setFontSize(size2);
    doc.text(`Sähköposti: ${user.email}`, horizontalOffset, verticalOffset);
    verticalOffset = updateAndGetVerticalOffset(size2 + paddingSize);
    doc.text(`Tunnus: ${user.sub}`, horizontalOffset, verticalOffset);

    verticalOffset = updateAndGetVerticalOffset(size2 + paddingSize + spacingSize);

    activities.forEach(activity => {
      // change page proactively if we're approaching the end
      if (pageLength - verticalOffset < 60) addPage();

      // Date + Activity name (if defined)
      const eventDate = parseDate(activity.eventDate);
      let title = formatDate(eventDate, 'fin');
      if (activity.series) {
        title += ': ' + activity.series
      }
      doc.setFontSize(size2);
      doc.text(title, horizontalOffset, verticalOffset);
      verticalOffset = updateAndGetVerticalOffset(size2 + paddingSize);

      activity.subTasks.forEach((subtask, index) => {
        // subtask
        doc.setFontSize(size3);
        doc.text(formatSubtask(index, subtask), 10 + horizontalOffset, verticalOffset);
        verticalOffset = updateAndGetVerticalOffset(size3 + paddingSize);
      });
      verticalOffset = updateAndGetVerticalOffset(size1 + paddingSize);

    });
    doc.save('a4.pdf')
  };

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
        activity.id = obj.id;
        appendActivity(activity);
      }
      sortActivities();
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

  const sortActivities = () => {
    setActivities(prevState => prevState.sort((a, b) => parseDate(a.eventDate) > parseDate(b.eventDate) ? -1 : 0));
  };

  const appendActivity = activity => {
    setActivities(prevState => prevState.concat(activity));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="App">
        <NavBar
          exportPdf={exportPdf}
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
