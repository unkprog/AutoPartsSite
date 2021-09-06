select top (10) [Id], [Date], [Name], [Email], [Question], [ParentId], [UserId]
from [AskQuestion] with(nolock)
where [UserId] = @UserId
order by [Date] desc, [Id] desc