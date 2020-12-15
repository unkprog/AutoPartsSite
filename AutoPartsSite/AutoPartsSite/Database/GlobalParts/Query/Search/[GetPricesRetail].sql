declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select * 
from [dbo].[r_PriceGet]
   (
     @SiteID
   , @SiteUserID
   --, @SiteUserUID
   , @LocaleLanguageID
   , @CountryID
   , @CurrencyID
   , @PartsXML
   , @WithSubst
   , @WithTotal
   , @WithCompare
   , @PromoCode
   )
order by [DeliveryTariffCode], [RowNumber]