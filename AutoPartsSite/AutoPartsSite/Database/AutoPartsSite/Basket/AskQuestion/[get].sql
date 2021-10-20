select top (50) [Id], [Date], [Name], [Email] = case when isnull([Email], '') = '' then 'Guest' else [Email] end, [Question], [ParentId], [UserId], [ReplyId]
from [AskQuestion] with(nolock)
where (@UserId = -1 or (@UserId <> -1 and ([Email] = @Email or [UserId] = @UserId))) and [ParentId] = 0
order by [Date] desc, [Id] desc