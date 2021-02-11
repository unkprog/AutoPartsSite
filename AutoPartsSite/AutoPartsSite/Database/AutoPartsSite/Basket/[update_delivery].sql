update [Basket_Header] set [DeliveryAddressID] = @DeliveryID where [Uid] = @Uid --and isnull([DeliveryAddressID], 0) = 0


