select [Uid], [GoodsID], [Quantity], [Price], [CurrencyID]
from [Basket] with(nolock)
where [Uid] = @Uid