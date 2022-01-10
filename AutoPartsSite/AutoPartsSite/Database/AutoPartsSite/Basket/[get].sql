select [GoodsID], [Qty], [CartPrice], [RowNumber]
from [Basket_Item] with(nolock)
where [Uid] = @Uid
order by [RowNumber] asc