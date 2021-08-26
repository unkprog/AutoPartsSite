insert into [AskQuestion] ([Date], [Name], [Email], [Question])
select getdate(), @Name, @Email, @Question
