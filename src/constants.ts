import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

// Numbers 

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString("0");
export const ONE_BD = BigDecimal.fromString("1");
export const BI_18 = BigInt.fromI32(18);

// Liquidity Pools

// dai had more liquidity/volume on v1 but USDC is better on v2 to present day
export const DAI_ETH_PAIR_UNI_V1 = "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667"
export const USDC_ETH_PAIR_UNI_V2 = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc";
export const usdcEthUniv2DeployBlockNumber: BigInt = BigInt.fromI32(10584355)

// Token Addresses
export const OCEAN = "";
