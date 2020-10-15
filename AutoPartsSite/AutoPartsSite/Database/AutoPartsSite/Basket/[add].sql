if exists(select * from [Basket] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID)
  update [Basket] set [Quantity] = @Quantity where [Uid] = @Uid and [GoodsID] = @GoodsID
else
  insert into [Basket]([Uid], [GoodsID], [Quantity], [Price], [CurrencyID])
  values(@Uid, @GoodsID, @Quantity, @Price, @CurrencyID)

