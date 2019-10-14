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


### 