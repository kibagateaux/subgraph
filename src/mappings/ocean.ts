import { WinningTicketRedeemed } from "../types/livepeer/TicketBroker";
import { DataToken } from '../types/schema'
import { getToken } from '../oceanTemplateHelper';
import {
    convertToDecimal,
    convertTokenToDecimal,
    getEthUsdPrice,
    createOrLoadPool,
    createOrLoadDay,
    createOrLoadProtocol
} from "../helpers";

const protocolName: string = "ocean-consume";

export function handleOrderStarted(event: OrderStarted): void {
    let protocol = createOrLoadProtocol(protocolName);
    let day = createOrLoadDay(protocolName, event.block.timestamp.toI32());
    let dataToken =  getToken(event.address, true);
    let fees = convertTokenToDecimal(
        event.params.amount.toBigDecimal(),
        dataToken.decimals()
      );
    let dataOceanPrice = createOrLoadPool(dataToken.pool).spotPrice;
    const ethPrice = (
        // find OCEAN pool
        // get OCEAN/dataToken  ratio
        // get ETH/OCEAN price
        // 
    )

    protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(ethPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.plus(fees.times(ethPrice));
    day.save();
}

export function handleOrderFinished(event: OrderFinished): void {
    let protocol = createOrLoadProtocol(protocolName);
    let day = createOrLoadDay(protocolName, event.block.timestamp.toI32());
    let dataToken =  getToken(event.address, true);
    let refund = convertTokenToDecimal(
        event.params.amount.toBigDecimal(),
        dataToken.decimals()
      );
  
    const ethPrice = (
        // find OCEAN pool
        // get OCEAN/dataToken  ratio
        // get ETH/OCEAN price
        // 
    )

    protocol.revenueUSD = protocol.revenueUSD.minus(refund.times(ethPrice));
    protocol.save();
  
    day.revenueUSD = day.revenueUSD.minus(refund.times(ethPrice));
    day.save();


}


export function handlePoolDeployed(event: FactoryPoolDeployed): void {
    // get tokens in pool
    // getToken(token)
    // token.pool = event.params.pool

}


// type Order @entity {  
//     "transaction hash - token address - from address"                                       
//     id: ID!                                                    
//     datatoken: Token!
//     consumer: User!
//     payer: User!
//     amount: BigDecimal!
//     serviceIndex: Int!
//     # the fees will be updated from an event that will be created after (todo)
//     publishingMarket: User
//     publishingMarketToken: Token                                #
//     publishingMarketAmmount: BigDecimal                         #call contract to get fee amount
//     consumerMarket: User
//     consumerMarketToken: Token                                  #
//     consumerMarketAmmount: BigDecimal                           #call contract to get fee amount
//     createdTimestamp: Int!
//     tx: String!
//     block: Int!
//   }
