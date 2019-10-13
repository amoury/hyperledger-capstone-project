/**
 * This function will update the acceleration reading for the shipment
 * @param {org.reliance.network.AccelarationReading} tx
 * @transaction
 */
async function AccelarationReading(tx) {
  const factory = getFactory();
  const NS = 'org.reliance.network';

  // Fetch the contract and the shipment for which this transaction is being called upon
  const shipmentsRegistry = await getAssetRegistry(`${NS}.Shipment`);
  const contractsRegistry = await getAssetRegistry(`${NS}.Contract`);
  
  const currentShipment = await shipmentsRegistry.get(tx.shipment.shipmentId);
  const currentContract = await contractsRegistry.get(currentShipment.contract.$identifier);
  
  // Trigger the 'Acceleration Threshold' event if the acceleration data is not in the required range
  const maxAcceleration = currentContract.maxAccelaration;
  const recordedAvgAcceleration = (tx.accelX + tx.accelY + tx.accelZ) / 3;
  
  if(recordedAvgAcceleration > maxAcceleration) {
  	const accelThresholdEvent = factory.newEvent(NS, 'AccelThreshold');
    const date = new Date();
    
    accelThresholdEvent.accelX = tx.accelX;
    accelThresholdEvent.accelY = tx.accelY;
    accelThresholdEvent.accelZ = tx.accelZ;
    accelThresholdEvent.lat = tx.lat;
    accelThresholdEvent.lng = tx.lng;
    accelThresholdEvent.message = 'The acceleration is more than the threshold';
    accelThresholdEvent.readingTime = tx.readingTime || date.toLocaleTimeString();
    accelThresholdEvent.shipment = tx.shipment;
    
    emit(accelThresholdEvent);
  }
  

  // Add acceleration data to the acceleration array with the shipment and save.
  currentShipment.accelarationReadings.push(tx);
  await shipmentsRegistry.update(currentShipment);
}



/**
 * This function will update the acceleration reading for the shipment
 * @param {org.reliance.network.TemperatureReading} tx
 * @transaction
 */
async function TemperatureReading(tx) {
  const factory = getFactory();
  const NS = 'org.reliance.network';

  // Fetch the contract and the shipment for which this transaction is being called upon
  const shipmentsRegistry = await getAssetRegistry(`${NS}.Shipment`);
  const contractsRegistry = await getAssetRegistry(`${NS}.Contract`);
  
  const currentShipment = await shipmentsRegistry.get(tx.shipment.shipmentId);
  const currentContract = await contractsRegistry.get(currentShipment.contract.$identifier);

  // Trigger the 'Temperature Threshold' event if the temperature data is not in the required range.
  const maxTemp = currentContract.maxTemp;
  const minTemp = currentContract.minTemp;
  
  if(tx.celcius > maxTemp || tx.celcius < minTemp) {
  	const tempThresholdEvent = factory.newEvent(NS, 'TempThreshold');
    const date = new Date();
    
    tempThresholdEvent.temp = tx.celcius;
    tempThresholdEvent.lat = tx.lat;
    tempThresholdEvent.lng = tx.lng;
    tempThresholdEvent.readingTime = tx.readingTime || date.toLocaleTimeString();
    tempThresholdEvent.shipment = tx.shipment;
    tempThresholdEvent.message = 'Temperature out of range';
    
    emit(tempThresholdEvent);
    
  }

  // Add the temperature data to the temperature array with the shipment and save.  
  currentShipment.temperatureReadings.push(tx);
  await shipmentsRegistry.update(currentShipment);
}


/**
 * This function will update the acceleration reading for the shipment
 * @param {org.reliance.network.GPSReading} tx
 * @transaction
 */
async function GPSReading(tx) {
  const factory = getFactory();
  const NS = 'org.reliance.network';

  // Fetch the contract and the shipment for which this transaction is being called upon
  const shipmentsRegistry = await getAssetRegistry(`${NS}.Shipment`);
  const contractsRegistry = await getAssetRegistry(`${NS}.Contract`);
  const importerRegistry = await getParticipantRegistry(`${NS}.Importer`);
  
  const currentShipment = await shipmentsRegistry.get(tx.shipment.shipmentId);
  const currentContract = await contractsRegistry.get(currentShipment.contract.$identifier);
  const importer = await importerRegistry.get(currentContract.importer.$identifier);

  // Get the GPS data that is input in the transaction.
  const currentLocation = `${tx.lat}${tx.latDir}, ${tx.lng}${tx.lngDir}`;
  
  // Trigger the 'Shipment In a Port' event if the GPS data matches the location of the importer  
  if(importer.address === currentLocation) {  
      const shipmentInPortEvent = factory.newEvent(NS, 'ShipmentInPort');
    
      shipmentInPortEvent.message = 'Shipment in the arrival port';
      shipmentInPortEvent.shipment = tx.shipment;
    
  	  emit(shipmentInPortEvent);
  }
  
  // Add the GPS data to the GPS array with the shipment.
  currentShipment.gpsReadings.push(tx);

  // Save the shipment asset registry with the newly added location details.
  await shipmentsRegistry.update(currentShipment);
}

/**
 * This function will update the acceleration reading for the shipment
 * @param {org.reliance.network.ShipmentReceived} tx
 * @transaction
 */
async function ShipmentReceived(tx) {
  const factory = getFactory();
  const NS = 'org.reliance.network';

  // Fetch the contract and the shipment for which this transaction is being called upon
  const shipmentsRegistry = await getAssetRegistry(`${NS}.Shipment`);
  const contractsRegistry = await getAssetRegistry(`${NS}.Contract`);
  const importerRegistry = await getParticipantRegistry(`${NS}.Importer`);
  const exporterRegistry = await getParticipantRegistry(`${NS}.Exporter`);
  const shipperRegistry = await getParticipantRegistry(`${NS}.Shipper`);
  
  const currentShipment = await shipmentsRegistry.get(tx.shipment.getIdentifier());
  const currentContract = await contractsRegistry.get(tx.shipment.contract.getIdentifier());
  const importer = await importerRegistry.get(currentContract.importer.getIdentifier());
  const exporter = await exporterRegistry.get(currentContract.exporter.getIdentifier());
  const shipper = await shipperRegistry.get(currentContract.shipper.getIdentifier());
  
  // Calculate the total payout by multiplying the unit price with the unit count.
  let totalPayout = currentContract.unitPrice * currentShipment.unitCount;
  
  // Update the shipment status to “Arrived”
  currentShipment.shipmentStatus = "Arrived";
  await shipmentsRegistry.update(currentShipment);
  
  // If the shipment is late as per the contract, set the payout to 0.
  const currentDate = new Date();
  const expectedArrivalDate = currentContract.arrivalDate;
  
  if(currentDate - expectedArrivalDate > 0) {
    totalPayout = 0;
  }
  
  // Map the contract temperature and acceleration values with that of the asset
  const contractMinTemp = currentContract.minTemp;
  const contractMaxTemp = currentContract.maxTemp;
  const contractMaxAccel = currentContract.maxAccelaration;
  const minPenaltyFactor = currentContract.minPenaltyFactor;
  const maxPenaltyFactor = currentContract.maxPenaltyFactor;
  
  const temperatureReadings = currentShipment.temperatureReadings;
  const accelerationReadings = currentShipment.accelarationReadings;
  const assetCount = currentShipment.unitCount;
  
  let penalty = 0;
  
  temperatureReadings.forEach(reading => {
    if(reading.celcius < contractMinTemp) {
      penalty += ((contractMinTemp - reading.celcius) * minPenaltyFactor);
    } else if(reading.celcius > contractMaxTemp ) {
      penalty += ((reading.celcius - contractMaxTemp) * maxPenaltyFactor);
    }
  });
  
  accelerationReadings.forEach(reading => {
  	const avgReading = (reading.accelX + reading.accelY + reading.accelZ) / 3;
    if(avgReading > contractMaxAccel) {
      penalty += (avgReading - contractMaxAccel) * maxPenaltyFactor;
    }
  });
  
  // Multiply the penalty with the total number of assets
  const totalPenalty = penalty * assetCount;
  totalPayout -= totalPenalty;
  
  // Update Importer
  importer.accountBalance -= Number(totalPayout.toFixed(2)) * 2;
  await importerRegistry.update(importer);
  
  // Update Exporter
  exporter.accountBalance += Number(totalPayout.toFixed(2));
  await exporterRegistry.update(exporter);
  
  // Update shipper
  shipper.accountBalance += Number(totalPayout.toFixed(2));
  await shipperRegistry.update(shipper);
}