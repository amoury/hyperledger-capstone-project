#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Reliance Network - Installing & Instantiating Chaincode"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
VERSION="$4"
: ${CHANNEL_NAME:="channelfiveorgs"}
: ${DELAY:="5"}
: ${LANGUAGE:="node"}
: ${VERSION:=1.1}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
ORGS="infrastructure power communications entertainment capital"

CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/"

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

## Install new version of chaincode on peer0 of all 5 orgs making them endorsers
echo "Installing chaincode on peer0.infrastructure.reliance-network.com ..."
installChaincode 0 'infrastructure' $VERSION
echo "Installing chaincode on peer0.power.reliance-network.com ..."
installChaincode 0 'power' $VERSION
echo "Installing chaincode on peer0.communications.reliance-network.com ..."
installChaincode 0 'communications' $VERSION
echo "Installing chaincode on peer0.entertainment.reliance-network.com ..."
installChaincode 0 'entertainment' $VERSION
echo "Installing chaincode on peer0.capital.reliance-network.com ..."
installChaincode 0 'capital' $VERSION

# Instantiate chaincode on the channel using peer0.infrastructure
echo "Instantiating chaincode on channel using peer0.infrastructure.reliance-network.com ..."
instantiateChaincode 0 'infrastructure' $VERSION

echo
echo "========= All GOOD, Reliance Network Chaincode Install completed =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
