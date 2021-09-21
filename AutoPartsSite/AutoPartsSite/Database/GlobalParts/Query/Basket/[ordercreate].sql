declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

exec [dbo].[r_OrderCreate] @LocaleLanguageID, @SiteID, @SiteUserID
