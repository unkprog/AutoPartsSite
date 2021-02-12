declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select * 
from [dbo].[r_SitePaymentGet]
	(
		@SiteID,
		@LocaleLanguageID,
		0, --@SitePaymentID int,
		'' --@SitePaymentCode int
	) [p]
order by [p].[SortIndex]