declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select [p].* from [dbo].[r_AddressGet]
	(
		@LocaleLanguageID,
		@SiteID,
		@SiteUserID,
		-1, --@CompanyID int,
		-1, --@CountryID,
		@AddressTypeID,
		-1, --@AddressID,
		-1, --@IsDefault
		-1 --@UserAddresses
	) [p]
