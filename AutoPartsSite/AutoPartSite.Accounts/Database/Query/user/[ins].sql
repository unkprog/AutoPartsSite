insert into [user] ([cu], [uu], [email])
select @cu, @uu, @email

select cast(scope_identity() as int)