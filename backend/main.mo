import Char "mo:base/Char";
import Order "mo:base/Order";

import Float "mo:base/Float";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import Option "mo:base/Option";

actor {
  // Types
  type OrderbookEntry = (Float, Float);
  type Orderbook = {
    bids: [OrderbookEntry];
    asks: [OrderbookEntry];
  };

  // Stable variables
  stable var lastUpdated: Int = 0;

  // Mutable variables
  var orderbook: Orderbook = { bids = []; asks = [] };

  // Helper function to parse float from text
  func parseFloat(t: Text) : Float {
    var int : Nat = 0;
    var frac : Nat = 0;
    var div : Nat = 1;
    var isNegative = false;
    for (c in t.chars()) {
      if (c == '-') {
        isNegative := true;
      } else if (c == '.') {
        div := 10;
      } else if (div == 1) {
        switch (Nat.fromText(Text.fromChar(c))) {
          case (?digit) { int := int * 10 + digit; };
          case (null) {};
        };
      } else {
        switch (Nat.fromText(Text.fromChar(c))) {
          case (?digit) { frac := frac * 10 + digit; };
          case (null) {};
        };
        div *= 10;
      };
    };
    let floatValue = Float.fromInt(int) + (Float.fromInt(frac) / Float.fromInt(div));
    if (isNegative) -floatValue else floatValue
  };

  // Mock function to generate orderbook data
  func mockOrderbookData() : Text {
    "bids: [8.1234,1.5],[8.1233,2.5],[8.1232,3.5]\nasks: [8.1235,1.0],[8.1236,2.0],[8.1237,3.0]"
  };

  // Helper function to parse API response
  func parseOrderbook(data: Text): Result.Result<Orderbook, Text> {
    let lines = Iter.toArray(Text.split(data, #text "\n"));
    let bids = Array.map<Text, OrderbookEntry>(Array.filter<Text>(lines, func(line) = Text.startsWith(line, #text "bids")), func(line) {
      let parts = Iter.toArray(Text.split(Text.trim(Text.replace(line, #text "bids: ", ""), #char '['), #text ","));
      (parseFloat(parts[0]), parseFloat(parts[1]))
    });
    let asks = Array.map<Text, OrderbookEntry>(Array.filter<Text>(lines, func(line) = Text.startsWith(line, #text "asks")), func(line) {
      let parts = Iter.toArray(Text.split(Text.trim(Text.replace(line, #text "asks: ", ""), #char '['), #text ","));
      (parseFloat(parts[0]), parseFloat(parts[1]))
    });
    #ok({ bids = bids; asks = asks })
  };

  // Update call to refresh orderbook data
  public func updateOrderbook(): async Result.Result<(), Text> {
    let mockData = mockOrderbookData();
    switch (parseOrderbook(mockData)) {
      case (#ok(newOrderbook)) {
        orderbook := newOrderbook;
        lastUpdated := Time.now();
        #ok()
      };
      case (#err(e)) #err(e);
    }
  };

  // Query call to get current orderbook
  public query func getOrderbook(): async Orderbook {
    orderbook
  };

  // Query call to get last update time
  public query func getLastUpdated(): async Int {
    lastUpdated
  };
}
