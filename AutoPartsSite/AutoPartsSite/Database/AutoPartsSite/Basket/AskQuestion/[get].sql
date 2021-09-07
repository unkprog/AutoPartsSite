select top (10) [Id], [Date], [Name], [Email], [Question], [ParentId], [UserId]
from [AskQuestion] with(nolock)
where ([Email] = @Email or [UserId] = @UserId) and [ParentId] = 0
order by [Date] desc, [Id] desc