import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Orderbook {
  'asks' : Array<OrderbookEntry>,
  'bids' : Array<OrderbookEntry>,
}
export type OrderbookEntry = [number, number];
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'getLastUpdated' : ActorMethod<[], bigint>,
  'getOrderbook' : ActorMethod<[], Orderbook>,
  'updateOrderbook' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
