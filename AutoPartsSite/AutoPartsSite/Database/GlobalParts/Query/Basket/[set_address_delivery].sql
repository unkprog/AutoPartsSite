declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

exec [dbo].[r_AddressUpdate]
		@SiteID,
		@SiteUserID, -- если = 0, то это гость, надо создать компанию.
		@LocaleLanguageID, 
		@AddressID, --0 - добавить новый адрес, > 0 = AddressID - изменить данные адреса
		@AddressType,
		@FullName,
		@CountryID,
		@ZipCode,
		@Region,
		@City,
		@Address,
		@PhoneCode,
		@PhoneMain,
		@PhoneExt,
		@Email,
		@DeliveryInstructions,
		@IsDefault 