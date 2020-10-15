-- en: User UID
-- ru: Пользователь UID

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[User_UID]') and type in (N'U'))
begin
  create table [User_UID]
  (
	[User] [int]          not null default (0),
	[Uid]  [nvarchar](50) not null default (N''),
	primary key clustered ([User])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'user_uid_idx_1')
  drop index [user_uid_idx_1] on [User_UID]

go

create nonclustered index [user_uid_idx_1] ON [User_UID] ([Uid])


