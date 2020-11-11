declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select * 
from [dbo].[GetPricesRetail] 
   (
     @SiteID
   , @SiteUserID
   , @IsGuest
   , @LocaleLanguageID
   , @CountryID
   , @CurrencyID
   , @PartsXML
   , @IsShowTotal
   )
order by [DeliveryTariffCode], [PartNn]