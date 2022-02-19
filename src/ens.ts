import {
    NameRegistered,
    NameRenewed
} from './types/ens/EthRegistrarController';

import {
    createOrLoadDay,
    createOrLoadProtocol,
    convertToDecimal,
    getEthUsdPrice,
} from "./helpers";

const protocolName: string = "ens";

export function handleNameRegisteredByController(event: NameRegistered): void {
    let protocol = createOrLoadProtocol(protocolName);
    let day = createOrLoadDay(protocolName, event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice(event.block.number);
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }

  export function handleNameRenewedByController(event: NameRenewed): void {
    let protocol = createOrLoadProtocol(protocolName);
    let day = createOrLoadDay(protocolName, event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice(event.block.number);
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }
  