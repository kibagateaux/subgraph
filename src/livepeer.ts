import { WinningTicketRedeemed } from "./types/livepeer/TicketBroker";
import {
    convertToDecimal,
    getEthUsdPrice,
    createOrLoadDay,
    createOrLoadProtocol
} from "./helpers";
const protocolName: string = "livepeer";

export function winningTicketRedeemed(event: WinningTicketRedeemed): void {
  let protocol = createOrLoadProtocol(protocolName);
  let day = createOrLoadDay(protocolName, event.block.timestamp.toI32());
  let fees = convertToDecimal(event.params.faceValue);
  let ethPrice = getEthUsdPrice(event.block.number);

  protocol.revenueUSD = protocol.revenueUSD.plus(fees.times(ethPrice));
  protocol.save();

  day.revenueUSD = day.revenueUSD.plus(fees.times(ethPrice));
  day.save();
}
