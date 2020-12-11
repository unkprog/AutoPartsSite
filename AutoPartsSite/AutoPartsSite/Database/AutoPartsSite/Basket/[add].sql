declare @DeliveryTariffID int 
declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))
declare @PartsXML xml
declare @Qty int

select top 1 @Qty = isnull([Qty],0) + @Quantity from [Basket_Item] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID

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


if exists(select * from [Basket_Item] with(nolock) where [Uid] = @Uid and [GoodsID] = @GoodsID)
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
else
begin
  declare @RowNumber int
  select @RowNumber = isnull(max([RowNumber]), 0) + 1 from [Basket_Item] where [Uid] = @Uid

  insert into [Basket_Item]([Uid], [RowNumber], [GoodsID], [Qty], [Brand], [Articul], [Descr]
                          , [WeightPhysical], [WeightVolumetric], [VolumetricDivider], [PromoCouponRate], [VatRate]
                          , [OrderPriceRaw], [OrderAmountRaw], [OrderDiscounts], [OrderDiscountsAmount], [OrderPrice]
                          , [OrderAmount], [OrderDeliveryAmount], [OrderTotalAmount], [OrderVatAmount], [OrderVatTotalAmount]
                          , [CartPriceRaw], [CartAmountRaw], [CartDiscounts], [CartDiscountsAmount], [CartPrice], [CartAmount]
                          , [CartDeliveryAmount], [CartTotalAmount], [CartVatAmount], [CartVatTotalAmount], [Comment], [TakeInvoicePrice], [InvoicePrice])
  select @Uid, @RowNumber, @GoodsID, [p].[Qty], [p].[Brand], [p].[Articul], [p].[Descr]
       , [p].[WeightPhysical], [p].[WeightVolumetric], [p].[VolumetricDivider], [p].[PromoCouponRate], [p].[VatRate]
       , [p].[OrderPriceRaw], [p].[OrderAmountRaw], [p].[OrderDiscounts], [p].[OrderDiscountsAmount], [p].[OrderPrice]
       , [p].[OrderAmount], [p].[OrderDeliveryAmount], [p].[OrderTotalAmount], [p].[OrderVatAmount], [p].[OrderVatTotalAmount]
       , [p].[CartPriceRaw], [p].[CartAmountRaw], [p].[CartDiscounts], [p].[CartDiscountsAmount], [p].[CartPrice], [p].[CartAmount]
       , [p].[CartDeliveryAmount], [p].[CartTotalAmount], [p].[CartVatAmount], [p].[CartVatTotalAmount], [Comment] = @Comment, [p].[TakeInvoicePrice], [p].[InvoicePrice]
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
                          ) [p]
  where [p].[DeliveryTariffID] = @DeliveryTariffID

end

