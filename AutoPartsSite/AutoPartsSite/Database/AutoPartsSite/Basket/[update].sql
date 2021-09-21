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


