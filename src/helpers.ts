import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Day, Protocol, Pool } from "./types/schema";
import { UniswapV2Pair } from "./types/ens/UniswapV2Pair";
import { UniswapV1Exchange } from "./types/ens/UniswapV1Exchange";
import {
    ZERO_BI,
    ONE_BI,
    ZERO_BD,
    ONE_BD,
    BI_18,
    DAI_ETH_PAIR_UNI_V1,
    USDC_ETH_PAIR_UNI_V2,
    usdcEthUniv2DeployBlockNumber,
} from './constants'

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function convertToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BI_18));
}

export function createOrLoadProtocol(id: string): Protocol {
  let protocol = Protocol.load(id);
  if (protocol == null) {
    protocol = new Protocol(id);
    protocol.revenueUSD = ZERO_BD;
    protocol.save();
  }
  return protocol as Protocol;
}

export function createOrLoadDay(protocolID: string, timestamp: i32): Day {
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400;
  let day = Day.load(protocolID + "-" + dayID.toString());

  if (day == null) {
    day = new Day(protocolID + "-" + dayID.toString());
    day.date = dayStartTimestamp;
    day.revenueUSD = ZERO_BD;
    day.protocol = protocolID;
    day.save();
  }
  return day as Day;
}

export function createOrLoadPool(poolId: string, protocolID: string): Day {
    let protocol = createOrLoadProtocol(protocolID);
    let pool = Pool.load(poolId);

    if (protocol == null) {
      pool = Pool.load(poolId);
      protocol.revenueUSD = ZERO_BD;
      protocol.save();
    }

  }


export function getPairPrice(pairAddress: string, reserve0Decimals: BigInt, reserve1Decimals: BigInt): BigDecimal {
  let pair = UniswapV2Pair.bind(
    Address.fromString(pairAddress)
  );
  let pairReserves = pair.getReserves();
  return convertTokenToDecimal(pairReserves.value0, reserve0Decimals).div(
    convertTokenToDecimal(pairReserves.value1, reserve1Decimals)
  );
}

export function getEthUsdPrice(blockNumber: BigInt): BigDecimal {
    let price: BigDecimal = ZERO_BD;
    // call v2 if block is after usdc/eth pair was deployed 
    if(blockNumber.gt(usdcEthUniv2DeployBlockNumber)) {
        price = getPairPrice(USDC_ETH_PAIR_UNI_V2, BigInt.fromI32(6), BigInt.fromI32(18));
    } else {
        let daiEthExchange = UniswapV1Exchange.bind(Address.fromString(DAI_ETH_PAIR_UNI_V1));
        price = convertToDecimal(
            daiEthExchange.getTokenToEthOutputPrice(BigInt.fromI32(10).pow(18))
        );
    }
    return price;
}
