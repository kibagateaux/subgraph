import { Token, Pool } from './types/schema'
import { ERC20Template } from './types/templates'
import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { ERC20 } from './types/templates/ERC20Template/ERC20'


// https://github.com/oceanprotocol/ocean-subgraph/blob/v4main/src/mappings/utils/tokenUtils.ts
export function createToken(address: Address, isDatatoken: boolean): Token {
    log.info('generating datatoken at address: {}', [address.toHexString()])
    if (isDatatoken) {
        ERC20Template.create(address)
    }
    const token = new Token(address.toHexString())
    const contract = ERC20.bind(address)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.address = address.toHexString()
    token.isDatatoken = isDatatoken
    token.decimals = contract.decimals()
    token.pool = null; // pool to get price from
    token.save()
    return token
}

export function getToken(address: Address, isDatatoken: boolean): Token {
    let newToken = Token.load(address.toHexString())
    if (newToken === null) {
        newToken = createToken(address, isDatatoken)
    }
    return newToken
}

// https://github.com/oceanprotocol/ocean-subgraph/commit/827d51b3e177436833439e22a4a1a4586781e278
export function setupPool(event: ethereum.Event, event_type: string, userAddress: string): void {
    let poolId = event.address.toHex()
    let pool = Pool.load(poolId)
  
    let ocnToken = Token.load(OCEAN)
    let dtToken = Token.load(poolId.concat('-').concat(pool.datatokenAddress))
    if (ocnToken == null || dtToken == null) {
      return
    }

    dtToken.price = calcSpotPrice(
        ocnToken.denormWeight,
        dtToken.denormWeight,
        ocnToken.balance,
        dtToken.balance,
        pool.swapFee
    )

    pool.datatokenReserve = dtToken.balance
    pool.oceanReserve = ocnToken.balance

    let p = Pool.bind(Address.fromString(poolId))
    let result = p.try_calcInGivenOut(
        decimalToBigInt(ocnToken.balance),
        decimalToBigInt(ocnToken.denormWeight),
        decimalToBigInt(dtToken.balance),
        decimalToBigInt(dtToken.denormWeight),
        ONE_INT, decimalToBigInt(pool.swapFee)
    )
    pool.consumePrice = result.reverted ? BigDecimal.fromString('-1') : bigIntToDecimal(result.value, 18)
    debuglog(
    'args to calcInGivenOut (ocnBalance, ocnWeight, dtBalance, dtWeight, dtAmount, swapFee, result)', null,
    [
        decimalToBigInt(ocnToken.balance).toString(),
        decimalToBigInt(ocnToken.denormWeight).toString(),
        decimalToBigInt(dtToken.balance).toString(),
        decimalToBigInt(dtToken.denormWeight).toString(),
        ONE_INT.toString(),
        decimalToBigInt(pool.swapFee).toString(),
        result.reverted ? 'failed' : result.value.toString()
    ]
    )

    pool.save()
    debuglog('updated pool reserves (source, dtBalance, ocnBalance, dtReserve, ocnReserve): ',
    event,
    ['createPoolTransaction', dtToken.balance.toString(), ocnToken.balance.toString(),
        pool.datatokenReserve.toString(), pool.oceanReserve.toString()])
}

export function calcSpotPrice(
    wIn: BigDecimal, wOut: BigDecimal,
    balanceIn: BigDecimal, balanceOut: BigDecimal,
    swapFee: BigDecimal
): BigDecimal {
    let numer = balanceIn.div(wIn)
    let denom = balanceOut.div(wOut)
    let ratio = numer.div(denom)
    let scale = ONE.div(ONE.minus(swapFee))
    return  ratio.times(scale)
}
