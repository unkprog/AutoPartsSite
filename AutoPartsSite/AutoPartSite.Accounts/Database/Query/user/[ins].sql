insert into [User] ([Cu], [Uu], [Email])
select @cu, @uu, @email

select cast(scope_identity() as int)