select [CouponID], [Code], [DescrEn], [DescrRu], [PromoCode], [Rate], [MultiplePromo]
from [Coupons] with(nolock)
where [Deleted] = 0 and [Active] = 1 and [Code] = @PromoCode and [StartDate] <= getdate() and getdate() <= [EndDate] 
