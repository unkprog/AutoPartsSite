insert into [User_Role] ([User], [Role])
select @user, @role

select cast(scope_identity() as int)