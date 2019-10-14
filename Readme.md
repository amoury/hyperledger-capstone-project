# Reliance-Network

This is an Asset Tracking System used by the Reliance group of industries to track the way the group companies share assets between each other.

## Setup

Setup part is made fairly easy with the use of the scripts so the user will not have to set up manually for each peer.

Firstly, Open the file with the name `networkConnection-infrastructure.yaml` located insider the *composer/* folder.

Search for all the places where this folder path is used and replace it with location of this folder on your system `/Users/ansarmemon/Documents/workspaces/hyperledger-capstone-submit/reliance-network`. You can find the folder location by typing `pwd` in the shell from within this folder.

That is all that is needed in terms of the setup.


## Get up and running

1. Enter the reliance-network folder using the command `cd reliance-network`
2. Type the command `./fabricNetwork.sh up`. Confirm to proceed by typing `y`. This will setup the whole network, install certificates and make peers join the channel.
3. Once the whole network is successfully running, we need to install the composer chaincode on each of the peers. This will done easily by typing the command `./fabricNetwork.sh composer` and confirm to proceed.
4. After this step is completed, just type the command `composer-playground`. This will spin up the composer playground on your `localhost:8080` and you should see the Admin cards and one of the participant cards.

<img width="1680" alt="Screen Shot 2019-10-14 at 3 08 18 PM" src="https://user-images.githubusercontent.com/16633104/66747067-a8701900-ee94-11e9-8115-76c0fa28fdb0.png">



## Steps for testing

1. Create the Shipper and Exporter participant. Issue an ID to Shipper as well so we can test the shipper role.
2. Connect to the network as an importer, then create a new `Contract` and `Shipment` like below -

<img width="1680" alt="Screen Shot 2019-10-14 at 2 51 25 PM" src="https://user-images.githubusercontent.com/16633104/66747426-8d51d900-ee95-11e9-9297-6a704a1f6b9d.png">

<img width="1680" alt="Screen Shot 2019-10-14 at 2 52 31 PM" src="https://user-images.githubusercontent.com/16633104/66747440-98a50480-ee95-11e9-820c-4c53e45d8b27.png">

3. Now login as **Shipper** to test the `GPSReading`, `AccelerationReading` and `TemperatureReading` transactions.

_AccelerationReading Transaction_
<img width="1680" alt="Screen Shot 2019-10-14 at 2 55 32 PM" src="https://user-images.githubusercontent.com/16633104/66755873-ed527a80-eea9-11e9-9cf7-cfa36ba29ecb.png">

_Result of AccelerationReading Transaction_
<img width="1680" alt="Screen Shot 2019-10-14 at 2 55 58 PM" src="https://user-images.githubusercontent.com/16633104/66755965-1c68ec00-eeaa-11e9-8c35-8bf39e0271e2.png">

_Initiating GPSReading with Importer's coordinates - this will trigger an event with message "Shipment in the arrival port"_
<img width="1371" alt="Screen Shot 2019-10-14 at 5 46 06 PM" src="https://user-images.githubusercontent.com/16633104/66756240-a1ec9c00-eeaa-11e9-8bfc-3acbd104758a.png">

_Emitted Event can be seen here (Need to be connected as an admin to see this)_
<img width="703" alt="Screen Shot 2019-10-14 at 5 49 33 PM" src="https://user-images.githubusercontent.com/16633104/66756431-0dcf0480-eeab-11e9-87b9-33153c936630.png">

4. Now login as an **Importer** to instantiate `ShipmentReceived` transaction

<img width="1108" alt="Screen Shot 2019-10-14 at 5 52 36 PM" src="https://user-images.githubusercontent.com/16633104/66756608-7322f580-eeab-11e9-8f1a-3924dbadc801.png">

5. Once this transaction is successful you should notice that the balance of each involved participants are adjusted accordingly.



