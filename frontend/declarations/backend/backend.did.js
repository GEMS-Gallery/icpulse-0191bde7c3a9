export const idlFactory = ({ IDL }) => {
  const OrderbookEntry = IDL.Tuple(IDL.Float64, IDL.Float64);
  const Orderbook = IDL.Record({
    'asks' : IDL.Vec(OrderbookEntry),
    'bids' : IDL.Vec(OrderbookEntry),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getLastUpdated' : IDL.Func([], [IDL.Int], ['query']),
    'getOrderbook' : IDL.Func([], [Orderbook], ['query']),
    'updateOrderbook' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
