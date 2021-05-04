declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select *, [Descr] = case when ltrim(rtrim([g].[DescrEn])) = '''' then ltrim(rtrim([g].[DescrRu])) else ltrim(rtrim([g].[DescrEn])) end 
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
   ) [t]
left join [Goods] [g] with(nolock) on [t].[GoodsID] = [g].[GoodsID]
order by [t].[DeliveryTariffCode], [t].[RowNumber]