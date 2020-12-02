update [Basket] set [DeliveryID] = @DeliveryID where [Uid] = @Uid and isnull([DeliveryID], 0) = 0


