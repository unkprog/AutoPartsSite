select top (10) [Id], [Date], [Name], [Email] = case when isnull([Email], '') = '' then 'Guest' else [Email] end, [Question], [ParentId], [UserId], [ReplyId]
from [AskQuestion] with(nolock)
where [Id] = @AskQuestionId or [ParentId] = @AskQuestionId
order by [Date] desc, [Id] desc