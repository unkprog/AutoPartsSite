select [pci].[BrandID], [pci].[BrandCode]
     , [NonGenuine] = case when @AnaloguesSeparateFile = 0 then cast(-1 as int) else cast([b].[NonGenuine] as int) end
     , [DeliveryTariffID] = case when @TariffSeparateFile = 0 then -1 else [pci].[DeliveryTariffID] end
from [PricesCustomersInside] [pci] with(nolock) 
left join [Brands] [b] with(nolock) on [pci].[BrandID] = [b].[BrandID]
where [CurrencyID] = @CurrencyID --and [StockQty] <> 0 
group by [pci].[BrandID], [pci].[BrandCode]
       , case when @AnaloguesSeparateFile = 0 then cast(-1 as int) else cast([b].[NonGenuine] as int) end
       , case when @TariffSeparateFile = 0 then -1 else [pci].[DeliveryTariffID] end