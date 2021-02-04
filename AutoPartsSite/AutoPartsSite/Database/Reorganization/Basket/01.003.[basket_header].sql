if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket_Header]') and type in (N'U'))
begin
  create table [Basket_Header]
  (
	[Id] [int] IDENTITY(1,1) not null,
	[Uid] [nvarchar](50) not null default(N''),
	[DeliveryRouteID] [int] not null,
	[DeliveryTariffID] [int] not null,
	[BasketDeliveryAddressID] [int] not null,
	[BasketBillingAddressID] [int] not null,
	[Comment] [nvarchar](150) not null default(N''),
	[OrderCurrencyID] [int] not null,
	[OrderCurrencyRate] [numeric](15, 4) not null,
	[CartCurrencyID] [int] not null,
	[CartCurrencyRate] [numeric](15, 4) not null,
	[InvoiceCurrencyID] [int] not null default(0),
	[InvoiceCurrencyRate] [numeric](15, 4) not null default(1),
	[AccountingCurrencyID] [int] not null, 
	[PromoCode] [nvarchar](20) not null default(N''),
	primary key clustered ([Id] asc)
  )
end

go

