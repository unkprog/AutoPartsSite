-- en: Basket
-- ru: Корзина

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket]') and type in (N'U'))
begin
  create table [Basket]
  (
	[Uid]        [nvarchar](50)   not null default (N''),
	[GoodsID]    [int]            not null,
	[Quantity]   [numeric](6, 0)  not null default (0),
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'basket_idx_1')
  drop index [basket_idx_1] on [Basket]

go

create nonclustered index [basket_idx_1] ON [Basket] ([Uid])


