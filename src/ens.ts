import {
    createOrLoadDay,
    createOrLoadProtocol,
    convertToDecimal,
    getEthUsdPrice,
} from "./helpers";

import { NameRegistered, NameRenewed } from './types/ens/EthRegistrarController';
  

export function handleNameRegisteredByController(event: NameRegistered): void {
    let protocol = createOrLoadProtocol("ens");
    let day = createOrLoadDay("ens", event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice();
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }

  export function handleNameRenewedByController(event: NameRenewed): void {
    let protocol = createOrLoadProtocol("ens");
    let day = createOrLoadDay("ens", event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice();
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }
  