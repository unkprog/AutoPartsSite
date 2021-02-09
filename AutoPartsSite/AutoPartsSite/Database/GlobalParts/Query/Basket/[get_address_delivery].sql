declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select * from [dbo].[r_AddressGet]
	(
		@SiteID,
		@SiteUserID,
		@LocaleLanguageID,
		0, --@CompanyID int,
		0, --@AddressID int,
		0, --@IsDefault bit,
		@CountryID  --@CountryID int
	) [p]
where [p].[AddressType] = @AddressType