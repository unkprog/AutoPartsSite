declare @retId int = isnull((select top 1 [Id] from [Basket_Header] [bh] with(nolock) where [bh].[Uid] = @Uid), 0)
if @retId = 0
begin
  insert into [Basket_Header] ([Uid], [DeliveryRouteID], [DeliveryTariffID], [DeliveryAddressID], [BillingAddressID], [Comment]
                             , [OrderCurrencyID], [OrderCurrencyRate], [CartCurrencyID], [CartCurrencyRate]
                             , [InvoiceCurrencyID], [InvoiceCurrencyRate], [AccountingCurrencyID], [PromoCode])
  select @Uid, [DeliveryRouteID] = 0, [DeliveryTariffID] = @DeliveryTariffID, [DeliveryAddressID] = 0, [BillingAddressID] = 0, [Comment] = N''
       , [OrderCurrencyID] = 0, [OrderCurrencyRate] = 0, [CartCurrencyID] = 0, [CartCurrencyRate] = 0
       , [InvoiceCurrencyID] = 0, [InvoiceCurrencyRate] = 0, [AccountingCurrencyID] = 0, [PromoCode] = N''
  select cast(scope_identity() as int)
end
else begin
  update [Basket_Header] set [DeliveryTariffID] = @DeliveryTariffID where [Id] = @retId
  select @retId
end