-- en: Basket delivery
-- ru: Корзина доставка

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket_Delivery]') and type in (N'U'))
begin
  create table [Basket_Delivery]
  (
    [Id]        [int]           identity(1,1) not null,
	[FirstName] [nvarchar](100) not null default (N''),
	[LastName]  [nvarchar](100) not null default (N''),
	[CountryID] [int]           not null,
	[City]      [nvarchar](100) not null default (0),
	[Zipcode]   [nvarchar](100) not null default (0),
	[Street]    [nvarchar](200) not null default (0),
	[Phone]     [nvarchar](100) not null default (0),
	primary key clustered ([Id])
  )
end

go