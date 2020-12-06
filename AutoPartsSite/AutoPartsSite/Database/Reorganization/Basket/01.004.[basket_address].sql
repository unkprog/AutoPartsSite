if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Basket_Address]') and type in (N'U'))
begin
  create table [Basket_Address] 
  (
     [Id] [int] identity(1,1) not null,
     [AddressID] [int] not null,
     [AddressType] [numeric](1, 0) not null,
     [FullName] [nvarchar](100) not null,
     [CountryID] [int] not null,
     [ZipCode] [nvarchar](20) not null,
     [Region] [nvarchar](50) not null,
     [City] [nvarchar](50) not null,
     [Address] [nvarchar](100) not null,
     [PhoneCode] [nvarchar](10) not null,
     [PhoneMain] [nvarchar](20) not null,
     [PhoneExt] [nvarchar](5) not null default(N''),
     [Email] [nvarchar](100) not null,
     [DeliveryInstructions] [nvarchar](100) not null  default(N''),
     [IsDefault] [bit] not null default(0),
     primary key clustered ([Id] asc)
  )
end

go
