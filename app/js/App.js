import React from 'react';
import {
  render,
} from 'react-dom';


import { browserHistory, Router, Route, IndexRoute,hashHistory } from 'react-router';
import Articles from './articles/Articles';
import Login from './login/Login';
import Merchants from './merchants/Merchants';
import ServiceShop from './merchants/ServiceShop';
import VehicleMakeMaps from './merchants/VehicleMakeMaps';
import ShopInfo from './merchants/ShopInfo';
import Reservation from './reservation/Reservation';
import ChooseVehicle from  './reservation/ChooseVehicle';
const routes = (
  <Router history={hashHistory}>
    <Route path="/owner/merchants" component={Merchants}>
      </Route>
    <Route path='/owner/login' component={Login}/>
    <Route path="/owner/articles" component={Articles}/>
    <Route path="/owner/serviceShop" component={ServiceShop}/>
    <Route path='/owner/serviceShop/vehiclemakemaps' component={VehicleMakeMaps}/>
    <Route path='/owner/serviceShop/shopinfo' component={ShopInfo}/>
    <Route path='/owner/reservation/createreservation' component={Reservation}/>
    <Route path='/owner/choosevehicle' component={ChooseVehicle}/>
  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});
