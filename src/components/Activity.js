import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Select from 'react-select'
import Creatable from 'react-select/creatable';
import { v4 as uuidv4 } from 'uuid';

const Activity = props => {
  const [activityId, setActivityId] = React.useState(props.id);
  const [eventDate, setEventDate] = React.useState(props.eventDate);
  const [series, setSeries] = React.useState(props.series);
  const [distance, setDistance] = React.useState();
  const [subTasks, setSubtasks] = React.useState(props.subTasks || []);
  const [activityType, setActivityType] = React.useState();
  const [mechanism, setMechanism] = React.useState();
  const [caliber, setCaliber] = React.useState();
  const [shots, setShots] = React.useState('');

  const isEditable = () => {
    return editMode || props.setModalShow;
  };

  const handleCreateActivity = () => {
    const activity = {
      eventDate: eventDate,
      series: series,
      subTasks: subTasks
    }
    props.appendActivity(activity);
    props.setModalShow(false);
  };

  const handleCreateSubtask = () => {
    setSubtasks(subTasks.concat(
        {
          id: uuidv4(),
          activityType: activityType,
          mechanism: mechanism,
          caliber: caliber,
          shots: parseInt(shots),
          distance: distance
        }
    ));
    setActivityType(null);
    setMechanism(null);
    setCaliber(null);
    setShots('');
    setDistance(null);
  };

  const processEvent = event => event ? event.value : null;
  const processDefault = value => value ? {value: value, label: value} : null;

  const handleEventDateChange = event => {
    setEventDate(event.target.value);
  };
  const handleSeriesChange = event => {
    setSeries(event.target.value);
  };
  const handleActivityTypeSelect = event => {
    console.log(event);
    setActivityType(processEvent(event));
  };
  const handleMechanismSelect = event => {
    setMechanism(processEvent(event));
  };
  const handleCaliberChanged = event => {
    setCaliber(processEvent(event));
  };
  const handleShotsChanged = event => {
    console.log(event.target);
    setShots(event.target.value);
  };
  const handleDistanceChanged = event => {
    setDistance(processEvent(event));
  };


  const [editMode, setEditMode] = React.useState(false);

  const handleEditMode = (newEditMode) => {
    setEditMode(newEditMode);
  };

  const handleDeleteActivity = () => {
    props.deleteActivity(props.id);
  };

  const cardStyle = {
    alignContent: 'center',
    maxWidth: '600px'
  };

  const saveActivity = () => {
    const activity = {
      id: props.id,
      eventDate: eventDate,
      series: series,
      subTasks: subTasks
    }
    props.updateActivity(activity);
  };

  const renderSubtasks = () => (
      <Container>
        {subTasks.map((subtask, index) => (
            <Row>
              <Col xs>
                {index + 1 + '. '}
                {subtask.activityType + ', '}
                {subtask.mechanism + ' '}
                {subtask.caliber ? ' (' + subtask.caliber + ')' : undefined}
                {': ' + subtask.shots} kpl
                {subtask.distance ? ' (' + subtask.distance + (!isNaN(subtask.distance) ? ' m' : '') + ')' : undefined}
              </Col>
            </Row>
        ))}
      </Container>
  );

  const renderCreateSubtask = () => (
      isEditable() ?
          <Row key={props.id}>
            <Col xs>
              <Form.Label>Uusi sarja</Form.Label>
            </Col>
            <Col>
              <Form.Group>
                <Row>
                  <Col>
                    <Select
                        key={1}
                        placeholder="Asetyyppi"
                        isClearable={true}
                        value={processDefault(activityType)}
                        onChange={event => handleActivityTypeSelect(event)}
                        isDisabled={!isEditable()}
                        options={[
                          { value: 'haulikko', label: 'haulikko' },
                          { value: 'kivääri', label: 'kivääri' },
                          { value: 'pienoiskivääri', label: 'pienoiskivääri' },
                          { value: 'pistooli', label: 'pistooli' },
                          { value: 'pienoispistooli', label: 'pienoispistooli' },
                          { value: 'revolveri', label: 'revolveri' },
                          { value: 'pienoisrevolveri', label: 'pienoisrevolveri' },
                          { value: 'yhdistelmäase', label: 'yhdistelmäase' },
                          { value: 'kaasuase', label: 'kaasuase' },
                          { value: 'merkinantopistooli', label: 'merkinantopistooli' },
                          { value: 'mustaruutiase', label: 'mustaruutiase' },
                          { value: 'ilma-ase', label: 'ilma-ase' },
                          { value: 'jousi', label: 'jousi' },
                          { value: 'muu', label: 'muu' }
                        ]} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Select
                        key={2}
                        placeholder="Toimintamekanismi"
                        isClearable={true}
                        value={processDefault(mechanism)}
                        onChange={event => handleMechanismSelect(event)}
                        isDisabled={!isEditable()}
                        options={[
                          { value: 'kertatuli', label: 'kertatuli' },
                          { value: 'lippaallinen kertatuli', label: 'lippaallinen kertatuli' },
                          { value: 'itselataava kertatuli', label: 'itselataava kertatuli' },
                          { value: 'sarjatuli', label: 'sarjatuli' },
                        ]} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Creatable
                        key={3}
                        placeholder="Kaliiperi"
                        isClearable={true}
                        value={processDefault(caliber)}
                        onChange={event => handleCaliberChanged(event)}
                        isDisabled={!isEditable()}
                        options={[
                          {'value': '2 mm Kolibri', 'label': '2 mm Kolibri'},
                          {'value': '4.6×30mm', 'label': '4.6×30mm'},
                          {'value': '5 mm Remington Rimfire Magnum', 'label': '5 mm Remington Rimfire Magnum'},
                          {'value': '5.45×18mm', 'label': '5.45×18mm'},
                          {'value': '5.45×39mm', 'label': '5.45×39mm'},
                          {'value': '5.56×45mm NATO', 'label': '5.56×45mm NATO'},
                          {'value': '5.56×45mm NATO SS109', 'label': '5.56×45mm NATO SS109'},
                          {'value': '5.6mm Gw Pat 90', 'label': '5.6mm Gw Pat 90'},
                          {'value': '5.7×28mm', 'label': '5.7×28mm'},
                          {'value': '5.8×42mm DBP87', 'label': '5.8×42mm DBP87'},
                          {'value': '6×57mm Mauser', 'label': '6×57mm Mauser'},
                          {'value': '6×62mm Freres', 'label': '6×62mm Freres'},
                          {'value': '6mm Lee Navy', 'label': '6mm Lee Navy'},
                          {'value': '6 mm PPC', 'label': '6 mm PPC'},
                          {'value': '6mm Remington', 'label': '6mm Remington'},
                          {'value': '6mm BR Norma', 'label': '6mm BR Norma'},
                          {'value': '6mm XC', 'label': '6mm XC'},
                          {'value': '6.5mm Creedmoor', 'label': '6.5mm Creedmoor'},
                          {'value': '6.5×47mm Lapua', 'label': '6.5×47mm Lapua'},
                          {'value': '6.5 Grendel', 'label': '6.5 Grendel'},
                          {'value': '6.5mm JDJ', 'label': '6.5mm JDJ'},
                          {'value': '6.5×50mmSR Arisaka', 'label': '6.5×50mmSR Arisaka'},
                          {'value': '6.5×52mm Mannlicher–Carcano', 'label': '6.5×52mm Mannlicher–Carcano'},
                          {'value': '6.5×53mmR', 'label': '6.5×53mmR'},
                          {'value': '6.5×54mm MS', 'label': '6.5×54mm MS'},
                          {'value': '6.5×54mm Mauser', 'label': '6.5×54mm Mauser'},
                          {'value': '6.5-300 Weatherby Magnum', 'label': '6.5-300 Weatherby Magnum'},
                          {'value': '6.5×55mm', 'label': '6.5×55mm'},
                          {'value': '6.5×57mm Mauser', 'label': '6.5×57mm Mauser'},
                          {'value': '6.5×58mm Vergueiro', 'label': '6.5×58mm Vergueiro'},
                          {'value': '6.5×68mm', 'label': '6.5×68mm'},
                          {'value': '6.5mm STW[14]', 'label': '6.5mm STW[14]'},
                          {'value': '6.8mm Remington SPC', 'label': '6.8mm Remington SPC'},
                          {'value': '7mm-08 Remington', 'label': '7mm-08 Remington'},
                          {'value': '7mm BR Remington', 'label': '7mm BR Remington'},
                          {'value': '7mm Remington Magnum', 'label': '7mm Remington Magnum'},
                          {'value': '7mm Remington Short Action Ultra Magnum', 'label': '7mm Remington Short Action Ultra Magnum'},
                          {'value': '7mm Remington Ultra Magnum', 'label': '7mm Remington Ultra Magnum'},
                          {'value': '7mm STW', 'label': '7mm STW'},
                          {'value': '7mm Weatherby Magnum', 'label': '7mm Weatherby Magnum'},
                          {'value': '7mm WSM', 'label': '7mm WSM'},
                          {'value': '7×57mm Mauser', 'label': '7×57mm Mauser'},
                          {'value': '7×64mm', 'label': '7×64mm'},
                          {'value': '7×65 R', 'label': '7×65 R'},
                          {'value': '7.35×51mm Carcano', 'label': '7.35×51mm Carcano'},
                          {'value': '7.5×55mm Swiss', 'label': '7.5×55mm Swiss'},
                          {'value': '7.5×57mm MAS', 'label': '7.5×57mm MAS'},
                          {'value': '7.62×25mm Tokarev', 'label': '7.62×25mm Tokarev'},
                          {'value': '7.62×38mmR', 'label': '7.62×38mmR'},
                          {'value': '7.62×39mm', 'label': '7.62×39mm'},
                          {'value': '7.62×51mm NATO', 'label': '7.62×51mm NATO'},
                          {'value': '7.62×54mmR', 'label': '7.62×54mmR'},
                          {'value': '7.63×25mm Mauser', 'label': '7.63×25mm Mauser'},
                          {'value': '7.65×21mm Parabellum', 'label': '7.65×21mm Parabellum'},
                          {'value': '7.7×58mm Arisaka', 'label': '7.7×58mm Arisaka'},
                          {'value': '7.92mm DS', 'label': '7.92mm DS'},
                          {'value': '7.92×33mm Kurz', 'label': '7.92×33mm Kurz'},
                          {'value': '8mm Lebel', 'label': '8mm Lebel'},
                          {'value': '8mm Remington Magnum', 'label': '8mm Remington Magnum'},
                          {'value': '8×53mmR Murata', 'label': '8×53mmR Murata'},
                          {'value': '8×56mm MS', 'label': '8×56mm MS'},
                          {'value': '8×57 I', 'label': '8×57 I'},
                          {'value': '8×57 IS', 'label': '8×57 IS'},
                          {'value': '8×58mmR Danish Krag', 'label': '8×58mmR Danish Krag'},
                          {'value': '8x60mm Mauser', 'label': '8x60mm Mauser'},
                          {'value': '8×64mm Brenneke', 'label': '8×64mm Brenneke'},
                          {'value': '8×68mm S', 'label': '8×68mm S'},
                          {'value': '9mm Browning Long', 'label': '9mm Browning Long'},
                          {'value': '9mm Mars', 'label': '9mm Mars'},
                          {'value': '9×18mm Makarov', 'label': '9×18mm Makarov'},
                          {'value': '9×19mm Parabellum', 'label': '9×19mm Parabellum'},
                          {'value': '9×53mmR', 'label': '9×53mmR'},
                          {'value': '9×56mm MS', 'label': '9×56mm MS'},
                          {'value': '9×57mm Mauser', 'label': '9×57mm Mauser'},
                          {'value': '9.3×57mm', 'label': '9.3×57mm'},
                          {'value': '9.3×62mm', 'label': '9.3×62mm'},
                          {'value': '9.3×64mm Brenneke', 'label': '9.3×64mm Brenneke'},
                          {'value': '9.3×74mmR', 'label': '9.3×74mmR'},
                          {'value': '9.5×57mm MS', 'label': '9.5×57mm MS'},
                          {'value': '10mm Auto', 'label': '10mm Auto'},
                          {'value': '10.75×68mm Mauser', 'label': '10.75×68mm Mauser'},
                          {'value': '11mm Gras', 'label': '11mm Gras'},
                          {'value': '11×60mm Mauser', 'label': '11×60mm Mauser'},
                          {'value': '11×60mm Murata', 'label': '11×60mm Murata'},
                          {'value': '.17 Hornet', 'label': '.17 Hornet'},
                          {'value': '.17 HM2', 'label': '.17 HM2'},
                          {'value': '.17 HMR', 'label': '.17 HMR'},
                          {'value': '.17 Remington', 'label': '.17 Remington'},
                          {'value': '.17 Remington Fireball', 'label': '.17 Remington Fireball'},
                          {'value': '.17 WSM', 'label': '.17 WSM'},
                          {'value': '.204 Ruger', 'label': '.204 Ruger'},
                          {'value': '.218 Bee', 'label': '.218 Bee'},
                          {'value': '.22 BR Remington', 'label': '.22 BR Remington'},
                          {'value': '.22 Hornet', 'label': '.22 Hornet'},
                          {'value': '.22 Long Rifle', 'label': '.22 Long Rifle'},
                          {'value': '.22 PPC', 'label': '.22 PPC'},
                          {'value': '.22 Short', 'label': '.22 Short'},
                          {'value': '.22 WMR', 'label': '.22 WMR'},
                          {'value': '.22-250 Remington', 'label': '.22-250 Remington'},
                          {'value': '.220 Swift', 'label': '.220 Swift'},
                          {'value': '.221 Remington Fireball', 'label': '.221 Remington Fireball'},
                          {'value': '.222 Remington', 'label': '.222 Remington'},
                          {'value': '.223 Remington', 'label': '.223 Remington'},
                          {'value': '.223 WSSM', 'label': '.223 WSSM'},
                          {'value': '.224 Boz', 'label': '.224 Boz'},
                          {'value': '.224 Weatherby Magnum', 'label': '.224 Weatherby Magnum'},
                          {'value': '.225 Winchester', 'label': '.225 Winchester'},
                          {'value': '.240 Apex', 'label': '.240 Apex'},
                          {'value': '.240 Weatherby Magnum', 'label': '.240 Weatherby Magnum'},
                          {'value': '.242 Rimless Nitro Express', 'label': '.242 Rimless Nitro Express'},
                          {'value': '.243 Winchester', 'label': '.243 Winchester'},
                          {'value': '.243 WSSM', 'label': '.243 WSSM'},
                          {'value': '.244 H&H Magnum', 'label': '.244 H&H Magnum'},
                          {'value': '.244 Halger Magnum', 'label': '.244 Halger Magnum'},
                          {'value': '.25 ACP', 'label': '.25 ACP'},
                          {'value': '.25 WSSM', 'label': '.25 WSSM'},
                          {'value': '.25-06 Remington', 'label': '.25-06 Remington'},
                          {'value': '.25-20 Winchester', 'label': '.25-20 Winchester'},
                          {'value': '.250-3000 Savage', 'label': '.250-3000 Savage'},
                          {'value': '.256 Winchester Magnum', 'label': '.256 Winchester Magnum'},
                          {'value': '.257 Roberts', 'label': '.257 Roberts'},
                          {'value': '.257 Weatherby Magnum', 'label': '.257 Weatherby Magnum'},
                          {'value': '.260 Remington', 'label': '.260 Remington'},
                          {'value': '.26 Nosler', 'label': '.26 Nosler'},
                          {'value': '.264 Winchester Magnum', 'label': '.264 Winchester Magnum'},
                          {'value': '.270 Weatherby Magnum', 'label': '.270 Weatherby Magnum'},
                          {'value': '.270 Winchester', 'label': '.270 Winchester'},
                          {'value': '.270 WSM', 'label': '.270 WSM'},
                          {'value': '.275 H&H Magnum', 'label': '.275 H&H Magnum'},
                          {'value': '.280 Jeffery', 'label': '.280 Jeffery'},
                          {'value': '.280 Ackley Improved', 'label': '.280 Ackley Improved'},
                          {'value': '.280 British', 'label': '.280 British'},
                          {'value': '.280 Remington', 'label': '.280 Remington'},
                          {'value': '.280 Ross', 'label': '.280 Ross'},
                          {'value': '.28 Nosler', 'label': '.28 Nosler'},
                          {'value': '.30 Carbine', 'label': '.30 Carbine'},
                          {'value': '.30 Nosler', 'label': '.30 Nosler'},
                          {'value': '.30 Remington AR', 'label': '.30 Remington AR'},
                          {'value': '.30 Herrett', 'label': '.30 Herrett'},
                          {'value': '.30-06 Springfield', 'label': '.30-06 Springfield'},
                          {'value': '.30-30 Winchester', 'label': '.30-30 Winchester'},
                          {'value': '.30-40 Krag', 'label': '.30-40 Krag'},
                          {'value': '.30-378 Weatherby Magnum', 'label': '.30-378 Weatherby Magnum'},
                          {'value': '300 AAC Blackout', 'label': '300 AAC Blackout'},
                          {'value': '.300 H&H Magnum', 'label': '.300 H&H Magnum'},
                          {'value': '.300 Remington Short Action Ultra Magnum', 'label': '.300 Remington Short Action Ultra Magnum'},
                          {'value': '.300 Remington Ultra Magnum', 'label': '.300 Remington Ultra Magnum'},
                          {'value': '.300 Ruger Compact Magnum', 'label': '.300 Ruger Compact Magnum'},
                          {'value': '.300 Savage', 'label': '.300 Savage'},
                          {'value': '.300 Weatherby Magnum', 'label': '.300 Weatherby Magnum'},
                          {'value': '.300 Whisper', 'label': '.300 Whisper'},
                          {'value': '.300 Winchester Magnum', 'label': '.300 Winchester Magnum'},
                          {'value': '.300 WSM', 'label': '.300 WSM'},
                          {'value': '.300 Norma Magnum', 'label': '.300 Norma Magnum'},
                          {'value': '.303 British', 'label': '.303 British'},
                          {'value': '.307 Winchester', 'label': '.307 Winchester'},
                          {'value': '.308 Marlin Express', 'label': '.308 Marlin Express'},
                          {'value': '.308 Norma Magnum', 'label': '.308 Norma Magnum'},
                          {'value': '.308 Winchester', 'label': '.308 Winchester'},
                          {'value': '.318 Westley Richards', 'label': '.318 Westley Richards'},
                          {'value': '.32 ACP', 'label': '.32 ACP'},
                          {'value': '.32 H&R Magnum', 'label': '.32 H&R Magnum'},
                          {'value': '.32 NAA', 'label': '.32 NAA'},
                          {'value': '.32 rimfire', 'label': '.32 rimfire'},
                          {'value': '.32 S&W', 'label': '.32 S&W'},
                          {'value': '.32 S&W Long', 'label': '.32 S&W Long'},
                          {'value': '.32 Winchester Self-Loading', 'label': '.32 Winchester Self-Loading'},
                          {'value': '.32 Winchester Special', 'label': '.32 Winchester Special'},
                          {'value': '.32-20 Winchester', 'label': '.32-20 Winchester'},
                          {'value': '.325 WSM', 'label': '.325 WSM'},
                          {'value': '.327 Federal Magnum', 'label': '.327 Federal Magnum'},
                          {'value': '.333 Jeffery', 'label': '.333 Jeffery'},
                          {'value': '.338 Federal', 'label': '.338 Federal'},
                          {'value': '.338-06', 'label': '.338-06'},
                          {'value': '.338 Lapua Magnum', 'label': '.338 Lapua Magnum'},
                          {'value': '.338 Norma Magnum', 'label': '.338 Norma Magnum'},
                          {'value': '.33 Nosler', 'label': '.33 Nosler'},
                          {'value': '.338 Marlin Express', 'label': '.338 Marlin Express'},
                          {'value': '.338 Remington Ultra Magnum', 'label': '.338 Remington Ultra Magnum'},
                          {'value': '.338 Ruger Compact Magnum', 'label': '.338 Ruger Compact Magnum'},
                          {'value': '.338 Winchester Magnum', 'label': '.338 Winchester Magnum'},
                          {'value': '.348 Winchester', 'label': '.348 Winchester'},
                          {'value': '.35 Remington', 'label': '.35 Remington'},
                          {'value': '.35 Whelen', 'label': '.35 Whelen'},
                          {'value': '.35 Winchester Self-Loading', 'label': '.35 Winchester Self-Loading'},
                          {'value': '.350 Remington Magnum', 'label': '.350 Remington Magnum'},
                          {'value': '.351 Winchester Self-Loading', 'label': '.351 Winchester Self-Loading'},
                          {'value': '.357 Magnum', 'label': '.357 Magnum'},
                          {'value': '.357 SIG', 'label': '.357 SIG'},
                          {'value': '.358 Winchester', 'label': '.358 Winchester'},
                          {'value': '.376 Steyr', 'label': '.376 Steyr'},
                          {'value': '.375 Holland & Holland Magnum', 'label': '.375 Holland & Holland Magnum'},
                          {'value': '.375 Ruger', 'label': '.375 Ruger'},
                          {'value': '.375 RUM', 'label': '.375 RUM'},
                          {'value': '.375 Weatherby Magnum', 'label': '.375 Weatherby Magnum'},
                          {'value': '.38 Long Colt', 'label': '.38 Long Colt'},
                          {'value': '.38 S&W', 'label': '.38 S&W'},
                          {'value': '.38 Special', 'label': '.38 Special'},
                          {'value': '.38 Super', 'label': '.38 Super'},
                          {'value': '.38-40 Winchester', 'label': '.38-40 Winchester'},
                          {'value': '.38-55 Winchester', 'label': '.38-55 Winchester'},
                          {'value': '.380 ACP', 'label': '.380 ACP'},
                          {'value': '.40 S&W', 'label': '.40 S&W'},
                          {'value': '.400 Corbon', 'label': '.400 Corbon'},
                          {'value': '.400 H&H Magnum', 'label': '.400 H&H Magnum'},
                          {'value': '.401 Winchester Self-Loading', 'label': '.401 Winchester Self-Loading'},
                          {'value': '.404 Jeffery', 'label': '.404 Jeffery'},
                          {'value': '.405 Winchester', 'label': '.405 Winchester'},
                          {'value': '.408 Cheyenne Tactical', 'label': '.408 Cheyenne Tactical'},
                          {'value': '.41 Action Express', 'label': '.41 Action Express'},
                          {'value': '.41 Long Colt', 'label': '.41 Long Colt'},
                          {'value': '.41 Remington Magnum', 'label': '.41 Remington Magnum'},
                          {'value': '.416 Barrett', 'label': '.416 Barrett'},
                          {'value': '.416 Remington Magnum', 'label': '.416 Remington Magnum'},
                          {'value': '.416 Rigby', 'label': '.416 Rigby'},
                          {'value': '.42 Berdan', 'label': '.42 Berdan'},
                          {'value': '.44 AMP', 'label': '.44 AMP'},
                          {'value': '.44 Henry', 'label': '.44 Henry'},
                          {'value': '.44 Magnum', 'label': '.44 Magnum'},
                          {'value': '.44 S&W American', 'label': '.44 S&W American'},
                          {'value': '.44 Special', 'label': '.44 Special'},
                          {'value': '.44-40 Winchester', 'label': '.44-40 Winchester'},
                          {'value': '.444 Marlin', 'label': '.444 Marlin'},
                          {'value': '.45 ACP', 'label': '.45 ACP'},
                          {'value': '.45 Colt', 'label': '.45 Colt'},
                          {'value': '.45 GAP', 'label': '.45 GAP'},
                          {'value': '.45 Winchester Magnum', 'label': '.45 Winchester Magnum'},
                          {'value': '45 Raptor', 'label': '45 Raptor'},
                          {'value': '.45-70', 'label': '.45-70'},
                          {'value': '.450 Adams', 'label': '.450 Adams'},
                          {'value': '.450 Bushmaster', 'label': '.450 Bushmaster'},
                          {'value': '.450 Marlin', 'label': '.450 Marlin'},
                          {'value': '.450 Nitro Express', 'label': '.450 Nitro Express'},
                          {'value': '.454 Casull', 'label': '.454 Casull'},
                          {'value': '.455 Webley', 'label': '.455 Webley'},
                          {'value': '.458 Lott', 'label': '.458 Lott'},
                          {'value': '.458 Winchester Magnum', 'label': '.458 Winchester Magnum'},
                          {'value': '.46 rimfire', 'label': '.46 rimfire'},
                          {'value': '.460 S&W Magnum', 'label': '.460 S&W Magnum'},
                          {'value': '.460 Weatherby', 'label': '.460 Weatherby'},
                          {'value': '.465 H&H Magnum', 'label': '.465 H&H Magnum'},
                          {'value': '.470 Nitro Express', 'label': '.470 Nitro Express'},
                          {'value': '.475 Linebaugh', 'label': '.475 Linebaugh'},
                          {'value': '.476 Enfield', 'label': '.476 Enfield'},
                          {'value': '.480 Ruger', 'label': '.480 Ruger'},
                          {'value': '.50 Action Express', 'label': '.50 Action Express'},
                          {'value': '.50 Alaskan', 'label': '.50 Alaskan'},
                          {'value': '.50 Beowulf', 'label': '.50 Beowulf'},
                          {'value': '.50 BMG', 'label': '.50 BMG'},
                          {'value': '.50 Remington Navy', 'label': '.50 Remington Navy'},
                          {'value': '.50-90 Sharps', 'label': '.50-90 Sharps'},
                          {'value': '.500 Linebaugh', 'label': '.500 Linebaugh'},
                          {'value': '.500 S&W Magnum', 'label': '.500 S&W Magnum'},
                          {'value': '.505 Gibbs', 'label': '.505 Gibbs'},
                          {'value': '.577 Snider', 'label': '.577 Snider'},
                          {'value': '.577/450 Martini–Henry', 'label': '.577/450 Martini–Henry'},
                          {'value': '.600 Nitro Express', 'label': '.600 Nitro Express'},
                          {'value': '.700 Nitro Express', 'label': '.700 Nitro Express'},
                          {'value': '12.7×108mm', 'label': '12.7×108mm'},
                          {'value': '14.5×114mm', 'label': '14.5×114mm'},
                          {'value': '.950 JDJ', 'label': '.950 JDJ'},
                          {'value': '.50 GI', 'label': '.50 GI'},
                        ]} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Control
                        key={4}
                        type="number"
                        placeholder="Laukaukset, lkm"
                        value={shots}
                        onChange={handleShotsChanged}
                        disabled={!isEditable()}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Creatable
                        key={5}
                        placeholder="Etäisyys"
                        isClearable={true}
                        value={processDefault(distance)}
                        onChange={event => handleDistanceChanged(event)}
                        isDisabled={!isEditable()}
                        options={[
                          {'value': '10', 'label': '10'},
                          {'value': '25', 'label': '25'},
                          {'value': '50', 'label': '50'},
                          {'value': '100', 'label': '100'},
                          {'value': '150', 'label': '150'},
                          {'value': '300', 'label': '300'}
                        ]}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Col>
                  <Button
                      key={6}
                      id="create-btn"
                      variant="primary"
                      type="button"
                      onClick={() => handleCreateSubtask()}
                      disabled={!shots || !activityType}
                  >
                    Lisää
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          : undefined
  );

  const renderCard = () => (
      <Container>
        <Form key={props.id} style={cardStyle}>
          <Form.Group controlId="formDate">
            <Row>
              <Col xs>
                <Form.Label>Päivämäärä</Form.Label>
              </Col>
              <Col>
                <Form.Control
                    type="input"
                    placeholder="2019-03-22"
                    value={eventDate}
                    onChange={handleEventDateChange}
                    disabled={!isEditable()}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formSeries">
            <Row>
              <Col xs>
                <Form.Label>Kuvaus</Form.Label>
              </Col>
              <Col>
                <Form.Control
                    type="input"
                    placeholder="Esim. SRA"
                    value={series}
                    onChange={handleSeriesChange}
                    disabled={!isEditable()}
                />
              </Col>
            </Row>
          </Form.Group>
          { subTasks.length ? <Row>
            <Col xs>
              <Form.Label>Sarjat</Form.Label>
            </Col>
            <Col>
              { renderSubtasks() }
            </Col>
          </Row> : undefined }
          { renderCreateSubtask() }
          <Row>
            <Col>
              { props.setModalShow ?
                  <Button
                      id="create-btn"
                      variant="primary"
                      type="button"
                      onClick={() => handleCreateActivity()}
                      disabled={!subTasks.length}
                  >
                    Luo
                  </Button> : undefined
              }
              { props.setActivities ?
                  <Button
                      id="edit-btn"
                      variant="primary"
                      type="button"
                      onClick={() => {
                        handleEditMode(!editMode);
                        if (editMode) saveActivity();
                      }}
                  >
                    {editMode ? 'Tallenna' : 'Muokkaa'}
                  </Button> : undefined
              }
              { props.setActivities ?
                  <Button
                      id="delete-btn"
                      variant="danger"
                      type="button"
                      onClick={() => handleDeleteActivity()}
                  >
                    Poista
                  </Button> : undefined
              }
            </Col>
          </Row>
        </Form>
      </Container>
  );

  const getTotalShots = () => {
      return subTasks.map(subTask => subTask.shots).reduce((prev, next) => prev + next, 0);
  };

  const renderHeader = () => (
    <Container>
      {eventDate}
      {series ? ' ' + series : undefined}
      {': '}
      laukaukset: {getTotalShots()}
    </Container>
  );

  return (
      !props.setModalShow && !editMode ?
      <Accordion>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          { renderHeader() }
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          { renderCard() }
        </Accordion.Collapse>
      </Accordion> : renderCard()
  );
};

export default Activity;
