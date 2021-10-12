select top (10) [Id], [Date], [Name], [Email], [Question], [ParentId], [UserId]
from [AskQuestion] with(nolock)
where [Id] = @AskQuestionId or [ParentId] = @AskQuestionId
order by [Date] desc, [Id] desc