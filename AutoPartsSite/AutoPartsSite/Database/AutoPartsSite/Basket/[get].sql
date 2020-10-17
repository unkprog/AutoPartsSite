select [GoodsID], [Quantity]
from [Basket] with(nolock)
where [Uid] = @Uid