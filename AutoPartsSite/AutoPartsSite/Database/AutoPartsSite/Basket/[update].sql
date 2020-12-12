declare @Qty int
select @Qty = @Quantity 

  update [t] set [Qty] = @Qty, [Brand] = @Brand, [Articul] = @Articul, [Descr] = @Descr
       , [WeightPhysical] = @WeightPhysical, [WeightVolumetric] = @WeightVolumetric, [VolumetricDivider] = @VolumetricDivider, [PromoCouponRate] = @PromoCouponRate, [VatRate] = @VatRate
       , [OrderPriceRaw] = @OrderPriceRaw, [OrderAmountRaw] = @OrderAmountRaw, [OrderDiscounts] = @OrderDiscounts, [OrderDiscountsAmount] = @OrderDiscountsAmount, [OrderPrice] =@OrderPrice
       , [OrderAmount] = @OrderAmount, [OrderDeliveryAmount] = @OrderDeliveryAmount, [OrderTotalAmount] = @OrderTotalAmount, [OrderVatAmount] = @OrderVatAmount, [OrderVatTotalAmount] = @OrderVatTotalAmount
       , [CartPriceRaw] = @CartPriceRaw, [CartAmountRaw] = @CartAmountRaw, [CartDiscounts] = @CartDiscounts, [CartDiscountsAmount] = @CartDiscountsAmount, [CartPrice] = @CartPrice, [CartAmount] = @CartAmount
       , [CartDeliveryAmount] = @CartDeliveryAmount, [CartTotalAmount] = @CartTotalAmount, [CartVatAmount] = @CartVatAmount, [CartVatTotalAmount] = @CartVatTotalAmount, [Comment] = @Comment
       , [TakeInvoicePrice] = @TakeInvoicePrice, [InvoicePrice] = @InvoicePrice
  from [Basket_Item] [t]
  where [t].[Uid] = @Uid and [t].[GoodsID] = @GoodsID

select @Qty


