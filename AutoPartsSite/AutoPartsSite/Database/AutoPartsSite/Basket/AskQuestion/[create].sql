insert into [AskQuestion] ([Date], [Name], [Email], [Question], [ParentId], [UserId], [ReplyId])
select getdate(), @Name, @Email, @Question, @ParentId, @UserId, @ReplyId
