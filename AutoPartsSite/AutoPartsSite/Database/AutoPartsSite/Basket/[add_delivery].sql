declare @Id int 

insert into [Basket_Delivery]([FirstName], [LastName], [CountryID], [City], [Zipcode], [Street], [Phone])
values(@FirstName, @LastName, @CountryID, @City, @Zipcode, @Street, @Phone)

select @Id = cast(scope_identity() as int)

update [Basket] set [DeliveryID] = @Id where [Uid] = @Uid 

