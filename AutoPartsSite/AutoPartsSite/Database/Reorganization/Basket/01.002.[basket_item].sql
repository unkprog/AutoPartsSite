if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket_Item]') and type in (N'U'))
begin
 create table [Basket_Item]
 (
	[Id] [int] IDENTITY(1,1) not null,
	[Uid] [nvarchar](50) not null default (N''),
	[RowNumber] [numeric](5, 0) not null,
	[GoodsID] [int] not null,
	[Quantity] [numeric](5, 0) not null default(0),
	[Price] [numeric](15, 2) not null,
	[Comment] [nvarchar](120) not null default(N''),
	[DeliveryPrice] [numeric](12, 2) not null,
	[DiscountsAmount] [numeric](12, 2) not null default(0),
	[PriceRaw] [numeric](15, 2) not null,
	[TakeInvoicePrice] [bit] not null default(0),
	[InvoicePrice] [numeric](15, 2) not null default(0),
    primary key clustered ([Id] asc)
  )
end

go
