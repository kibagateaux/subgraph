import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    createOrLoadDay,
    createOrLoadProtocol,
    getPairPrice,
    convertToDecimal,
    ZERO_BD,
    getEthUsdPrice,
} from "./helpers";
// import { UniswapExchange } from "./types/ens/UniswapExchange";
// import { UniswapV2Pair } from "./types/ens/UniswapV2Pair";

import {
    NameRegistered as ControllerNameRegisteredEvent,
    NameRenewed as ControllerNameRenewedEvent
  } from './types/ens/EthRegistrarController'
  

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
    let protocol = createOrLoadProtocol("ens");
    let day = createOrLoadDay("ens", event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice();
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }

  export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
    let protocol = createOrLoadProtocol("ens");
    let day = createOrLoadDay("ens", event.block.timestamp.toI32());
    let pairPrice = getEthUsdPrice();
    let fees = convertToDecimal(event.params.cost);
  
    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(pairPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(pairPrice));
    day.save();
  }
  