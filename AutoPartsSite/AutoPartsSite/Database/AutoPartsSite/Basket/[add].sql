if exists(select * from [Basket_Item] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID)
  update [Basket_Item] set [Quantity] = [Quantity] + @Quantity where [Uid] = @Uid and [GoodsID] = @GoodsID
else
begin
  declare @RowNumber int
  select @RowNumber = isnull(max([RowNumber]), 0) + 1 from [Basket_Item] where [Uid] = @Uid
  insert into [Basket_Item]([Uid], [RowNumber], [GoodsID], [Quantity], [Price], [Comment], [DeliveryPrice], [DiscountsAmount], [PriceRaw], [TakeInvoicePrice], [InvoicePrice])
  values(@Uid, @RowNumber, @GoodsID, @Quantity, 0 , '', 0, 0, 0, 0, 0)
end

