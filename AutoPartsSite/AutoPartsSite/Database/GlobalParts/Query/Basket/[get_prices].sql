declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))

select [p].[GoodsID], [p].[Qty], [p].[Brand], [p].[Articul], [p].[Descr]
     , [p].[WeightPhysical], [p].[WeightVolumetric], [p].[VolumetricDivider], [p].[PromoCouponRate], [p].[VatRate]
     , [p].[OrderPriceRaw], [p].[OrderAmountRaw], [p].[OrderDiscounts], [p].[OrderDiscountsAmount], [p].[OrderPrice]
     , [p].[OrderAmount], [p].[OrderDeliveryAmount], [p].[OrderTotalAmount], [p].[OrderVatAmount], [p].[OrderVatTotalAmount]
     , [p].[CartPriceRaw], [p].[CartAmountRaw], [p].[CartDiscounts], [p].[CartDiscountsAmount], [p].[CartPrice], [p].[CartAmount]
     , [p].[CartDeliveryAmount], [p].[CartTotalAmount], [p].[CartVatAmount], [p].[CartVatTotalAmount], [Comment] = @Comment
--     , [p].[TakeInvoicePrice], [p].[InvoicePrice] 

	 , [p].[DeliveryRouteID] -- сейчас не проставляетя
     , [p].[DeliveryTariffID] -- проставляется =  DeliveryRouteID
     , [p].[OrderCurrencyID]
     , [p].[OrderCurrencyRate]
     , [p].[CartCurrencyID]
     , [p].[CartCurrencyRate]
     , [InvoiceCurrencyID] = [p].[OrderCurrencyID]
     , [InvoiceCurrencyRate] = [p].[OrderCurrencyRate]
     , [p].[AccountingCurrencyID]

from [dbo].[r_PriceGet] ( @SiteID
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
                        ) [p]
where [p].[DeliveryTariffID] = @DeliveryTariffID