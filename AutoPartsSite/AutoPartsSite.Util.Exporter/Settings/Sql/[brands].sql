select [BrandID], [BrandCode] 
from [PricesCustomersInside] with(nolock) 
where [CurrencyID] = @CurrencyID and [StockQty] <> 0 
group by [BrandID], [BrandCode]