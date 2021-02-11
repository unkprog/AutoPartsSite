update [Basket_Header] set [BillingAddressID] = @BillingID where [Uid] = @Uid --and isnull([BillingAddressID], 0) = 0


