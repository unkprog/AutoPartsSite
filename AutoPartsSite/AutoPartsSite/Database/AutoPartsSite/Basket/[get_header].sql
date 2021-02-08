select [Id], [Uid], [DeliveryRouteID], [DeliveryTariffID], [DeliveryAddressID], [BillingAddressID], [Comment], [OrderCurrencyID], [OrderCurrencyRate], [CartCurrencyID], [CartCurrencyRate], [InvoiceCurrencyID], [InvoiceCurrencyRate], [AccountingCurrencyID], [PromoCode]
from [Basket_Header] with(nolock)
where [Uid] = @Uid