declare @Qty int = null
select top 1 @Qty = [Qty] from [Basket_Item] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID
select @Qty = isnull(@Qty,0) + @Quantity


declare @retId int = isnull((select top 1 [Id] from [Basket_Header] [bh] with(nolock) where [bh].[Uid] = @Uid), 0)
if @retId = 0
begin
  insert into [Basket_Header] ([Uid], [DeliveryRouteID], [DeliveryTariffID], [DeliveryAddressID], [BillingAddressID], [Comment]
                             , [OrderCurrencyID], [OrderCurrencyRate], [CartCurrencyID], [CartCurrencyRate]
                             , [InvoiceCurrencyID], [InvoiceCurrencyRate], [AccountingCurrencyID], [PromoCode])
  select @Uid, [DeliveryRouteID] = @DeliveryRouteID, [DeliveryTariffID] = @DeliveryTariffID, [DeliveryAddressID] = 0, [BillingAddressID] = 0, [Comment] = N''
       , [OrderCurrencyID] = @OrderCurrencyID, [OrderCurrencyRate] = @OrderCurrencyRate, [CartCurrencyID] = @CartCurrencyID, [CartCurrencyRate] = @CartCurrencyRate
       , [InvoiceCurrencyID] = @InvoiceCurrencyID, [InvoiceCurrencyRate] = @InvoiceCurrencyRate, [AccountingCurrencyID] = @AccountingCurrencyID, [PromoCode] =  N''
  select cast(scope_identity() as int)
end
--else begin
--  update [Basket_Header] set [PromoCode] = @PromoCode where  [Id] = @retId
--  select @retId
--end


if exists(select * from [Basket_Item] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID)
  update [t] set [Qty] = @Qty, [Brand] = @Brand, [Articul] = @Articul, [Descr] = @Descr
       , [WeightPhysical] = @WeightPhysical, [WeightVolumetric] = @WeightVolumetric, [VolumetricDivider] = @VolumetricDivider, [PromoCouponRate] = @PromoCouponRate, [VatRate] = @VatRate
       , [OrderPriceRaw] = @OrderPriceRaw, [OrderAmountRaw] = @OrderAmountRaw, [OrderDiscounts] = @OrderDiscounts, [OrderDiscountsAmount] = @OrderDiscountsAmount, [OrderPrice] = @OrderPrice
       , [OrderAmount] = @OrderAmount, [OrderDeliveryAmount] = @OrderDeliveryAmount, [OrderTotalAmount] = @OrderTotalAmount, [OrderVatAmount] = @OrderVatAmount, [OrderVatTotalAmount] = @OrderVatTotalAmount
       , [CartPriceRaw] = @CartPriceRaw, [CartAmountRaw] = @CartAmountRaw, [CartDiscounts] = @CartDiscounts, [CartDiscountsAmount] = @CartDiscountsAmount, [CartPrice] = @CartPrice, [CartAmount] = @CartAmount
       , [CartDeliveryAmount] = @CartDeliveryAmount, [CartTotalAmount] = @CartTotalAmount, [CartVatAmount] = @CartVatAmount, [CartVatTotalAmount] = @CartVatTotalAmount, [Comment] = @Comment
       , [TakeInvoicePrice] = @TakeInvoicePrice, [InvoicePrice] = @InvoicePrice
  from [Basket_Item] [t]
  where [t].[Uid] = @Uid and [t].[GoodsID] = @GoodsID
else
begin
  declare @RowNumber int
  select @RowNumber = isnull(max([RowNumber]), 0) + 1 from [Basket_Item] where [Uid] = @Uid

  insert into [Basket_Item]([Uid], [RowNumber], [GoodsID], [Qty], [Brand], [Articul], [Descr]
                          , [WeightPhysical], [WeightVolumetric], [VolumetricDivider], [PromoCouponRate], [VatRate]
                          , [OrderPriceRaw], [OrderAmountRaw], [OrderDiscounts], [OrderDiscountsAmount], [OrderPrice]
                          , [OrderAmount], [OrderDeliveryAmount], [OrderTotalAmount], [OrderVatAmount], [OrderVatTotalAmount]
                          , [CartPriceRaw], [CartAmountRaw], [CartDiscounts], [CartDiscountsAmount], [CartPrice], [CartAmount]
                          , [CartDeliveryAmount], [CartTotalAmount], [CartVatAmount], [CartVatTotalAmount], [Comment], [TakeInvoicePrice], [InvoicePrice])
  select @Uid, @RowNumber, @GoodsID, @Qty, @Brand, @Articul, @Descr
       , @WeightPhysical, @WeightVolumetric, @VolumetricDivider, @PromoCouponRate, @VatRate
       , @OrderPriceRaw, @OrderAmountRaw, @OrderDiscounts, @OrderDiscountsAmount, @OrderPrice
       , @OrderAmount, @OrderDeliveryAmount, @OrderTotalAmount, @OrderVatAmount, @OrderVatTotalAmount
       , @CartPriceRaw, @CartAmountRaw, @CartDiscounts, @CartDiscountsAmount, @CartPrice, @CartAmount
       , @CartDeliveryAmount, @CartTotalAmount, @CartVatAmount, @CartVatTotalAmount, @Comment, @TakeInvoicePrice, @InvoicePrice
end

