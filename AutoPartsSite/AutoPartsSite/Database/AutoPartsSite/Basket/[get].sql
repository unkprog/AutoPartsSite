select [GoodsID], [Qty], [CartPrice]
from [Basket_Item] with(nolock)
where [Uid] = @Uid