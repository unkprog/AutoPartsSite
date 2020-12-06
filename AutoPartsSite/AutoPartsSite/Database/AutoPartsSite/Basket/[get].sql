select [GoodsID], [Quantity]
from [Basket_Item] with(nolock)
where [Uid] = @Uid