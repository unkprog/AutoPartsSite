-- en: Questionы
-- ru: Вопросы 

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[AskQuestion]') and type in (N'U'))
begin
  create table [AskQuestion]
  (
	[Id]          [int]           identity(1,1) not null,
	[Date]        [datetime]      not null default (getdate()),
	[Name]        [nvarchar](100) not null default (N''),
	[Email]       [nvarchar](100) not null default (N''),
	[Question]    [nvarchar](3700) not null default (N''),
	[ParentId]    [int]            not null default (0),
	[UserId]    [int]              not null default (0),
	primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'new_idx_1')
  drop index [askquestion_idx_1] on [AskQuestion]

go

create nonclustered index [askquestion_idx_1] ON [AskQuestion] ([Date], [Email])
