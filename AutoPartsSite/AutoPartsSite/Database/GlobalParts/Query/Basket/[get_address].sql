declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select [p].* from [dbo].[r_AddressGet]
	(
		@LocaleLanguageID,
		@SiteID,
		@SiteUserID,
		0, --@CompanyID int,
		0, --@CountryID,
		@AddressTypeID,
		0, --@AddressID,
		0, --@IsDefault
		0 --@UserAddresses
	) [p]
