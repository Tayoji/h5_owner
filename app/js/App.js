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
import ServiceCategorys from './reservation/ServiceCategorys';
import OwnerReservations from './reservation/OwnerReservations';
import ReservationDetail from './reservation/ReservationDetail';
import OrderNoComplete from './order/OrderNoComplete';
import OrderDetails from  './order/OrderDetails'
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
    <Route path='/owner/servicecategorys' component={ServiceCategorys}/>
    <Route path='/owner/ownerreservations' component={OwnerReservations}/>
    <Route path='/owner/reservation/details' component={ReservationDetail}/>
    <Route path='/owner/order/nocomplete' component={OrderNoComplete}/>
    <Route path='/owner/order/details' component={OrderDetails}/>

  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});
