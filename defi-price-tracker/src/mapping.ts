import { PriceLogged as PriceLoggedEvent } from "../generated/PriceTracker/PriceTracker"
import { PriceRecord } from "../generated/schema"

export function handlePriceLogged(event: PriceLoggedEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let entity = new PriceRecord(id);

  entity.token = event.params.token; 
  entity.price = event.params.price;
  entity.timestamp = event.block.timestamp; 
  
  // FIX: You must assign a value to every non-nullable field defined in schema.graphql
  entity.blockNumber = event.block.number; 
  
  entity.save();
}
