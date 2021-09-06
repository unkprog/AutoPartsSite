insert into [AskQuestion] ([Date], [Name], [Email], [Question], [ParentId], [UserId])
select getdate(), @Name, @Email, @Question, @ParentId, @UserId
