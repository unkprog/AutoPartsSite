select [GoodsID], [Quantity], [Price]
from [Basket] with(nolock)
where [Uid] = @Uid