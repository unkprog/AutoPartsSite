if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket_Item]') and type in (N'U'))
begin
 create table [dbo].[Basket_Item]
 (
	[Id] [int] IDENTITY(1,1) not null,
	[Uid] [nvarchar](50) not null default (N''),
	[RowNumber] [numeric](5, 0) not null,
	[GoodsID] [int] not null,
	[Brand] [nvarchar](50) not null,
	[Articul] [nvarchar](50) not null,
	[Descr] [nvarchar](255) not null,
	[WeightPhysical] [numeric](10, 3) not null,
	[WeightVolumetric] [numeric](10, 3) not null,
	[VolumetricDivider] [numeric](10, 2) not null,
	[PromoCouponRate] [numeric](18, 5) not null,
	[VatRate] [numeric](15, 6) not null,
	[Qty] [numeric](5, 0) not null default (0),
	[OrderPriceRaw] [numeric](15, 2) not null,
	[OrderAmountRaw] [numeric](15, 2) not null,
	[OrderDiscounts] [numeric](15, 2) not null,
	[OrderDiscountsAmount] [numeric](15, 2) not null,
	[OrderPrice] [numeric](15, 2) not null,
	[OrderAmount] [numeric](15, 2) not null,
	[OrderDeliveryAmount] [numeric](15, 2) not null,
	[OrderTotalAmount] [numeric](15, 2) not null,
	[OrderVatAmount] [numeric](15, 2) not null,
	[OrderVatTotalAmount] [numeric](15, 2) not null,
	[CartPriceRaw] [numeric](15, 2) not null,
	[CartAmountRaw] [numeric](15, 2) not null,
	[CartDiscounts] [numeric](15, 2) not null,
	[CartDiscountsAmount] [numeric](15, 2) not null,
	[CartPrice] [numeric](15, 2) not null,
	[CartAmount] [numeric](15, 2) not null,
	[CartDeliveryAmount] [numeric](15, 2) not null,
	[CartTotalAmount] [numeric](15, 2) not null,
	[CartVatAmount] [numeric](15, 2) not null,
	[CartVatTotalAmount] [numeric](15, 2) not null,
	[Comment] [nvarchar](120) not null default (N''),
	[TakeInvoicePrice] [bit] not null default (0),
	[InvoicePrice] [numeric](15, 2) not null default (0),
    primary key clustered ([Id] asc)
  )
end

go
