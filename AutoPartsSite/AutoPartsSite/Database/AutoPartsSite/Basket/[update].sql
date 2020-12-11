declare @DeliveryTariffID int 
declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))
declare @PartsXML xml
declare @Qty int

select @Qty = @Quantity

select top 1 @PartsXML = '<ROOT><Part RowNumber="1" GoodsId="' + ltrim(str([g].[GoodsID])) + '" PartNumber="' + [g].[PartNumber] + '" Brand="' + [b].[Code] + '" Qty="' + ltrim(str(@Qty)) + '" /></ROOT>'
from [Goods]       [g] with(nolock)
left join [Brands] [b] with(nolock) on [g].[BrandID]   = [b].[BrandID]
where [g].[Deleted] = 0 and [g].[GoodsID] = @GoodsID

select top 1 @DeliveryTariffID = isnull([DeliveryTariffID], 0) from [Basket_Header] with(nolock) where [Uid] = @Uid 
if @DeliveryTariffID = 0
begin
  select top 1 @DeliveryTariffID = DeliveryTariffID 
  from [dbo].[r_PriceGet] ( @SiteID
                          , @SiteUserID
                          , @SiteUserUID
                          , @LocaleLanguageID
                          , @CountryID
                          , @CurrencyID
                          , @PartsXML
                          , @WithSubst
                          , @WithTotal
                          , @WithCompare
                          , @PromoCode
                          )
  order by [DeliveryDaysMax] 
end

  update [t] set [Qty] = [p].[Qty], [Brand] = [p].[Brand], [Articul] = [p].[Articul], [Descr] = [p].[Descr]
       , [WeightPhysical] = [p].[WeightPhysical], [WeightVolumetric] = [p].[WeightVolumetric], [VolumetricDivider] = [p].[VolumetricDivider], [PromoCouponRate] = [p].[PromoCouponRate], [VatRate] = [p].[VatRate]
       , [OrderPriceRaw] = [p].[OrderPriceRaw], [OrderAmountRaw] = [p].[OrderAmountRaw], [OrderDiscounts] = [p].[OrderDiscounts], [OrderDiscountsAmount] = [p].[OrderDiscountsAmount], [OrderPrice] =[p].[OrderPrice]
       , [OrderAmount] = [p].[OrderAmount], [OrderDeliveryAmount] = [p].[OrderDeliveryAmount], [OrderTotalAmount] = [p].[OrderTotalAmount], [OrderVatAmount] = [p].[OrderVatAmount], [OrderVatTotalAmount] = [p].[OrderVatTotalAmount]
       , [CartPriceRaw] = [p].[CartPriceRaw], [CartAmountRaw] = [p].[CartAmountRaw], [CartDiscounts] = [p].[CartDiscounts], [CartDiscountsAmount] = [p].[CartDiscountsAmount], [CartPrice] = [p].[CartPrice], [CartAmount] = [p].[CartAmount]
       , [CartDeliveryAmount] = [p].[CartDeliveryAmount], [CartTotalAmount] = [p].[CartTotalAmount], [CartVatAmount] = [p].[CartVatAmount], [CartVatTotalAmount] = [p].[CartVatTotalAmount], [Comment] = @Comment, [TakeInvoicePrice] = [p].[TakeInvoicePrice], [InvoicePrice] = [p].[InvoicePrice]
  from [Basket_Item] [t]
  inner join [dbo].[r_PriceGet] ( @SiteID
                          , @SiteUserID
                          , @SiteUserUID
                          , @LocaleLanguageID
                          , @CountryID
                          , @CurrencyID
                          , @PartsXML
                          , @WithSubst
                          , @WithTotal
                          , @WithCompare
                          , @PromoCode
                          ) [p] on [t].[GoodsID] = [p].[GoodsID] and [p].[DeliveryTariffID] = @DeliveryTariffID

  where [t].[Uid] = @Uid and [t].[GoodsID] = @GoodsID



select @Qty


