namespace AutoPartsSite
{
    public static partial class AppSettings
    {
        public static class Query
        {
            public static Core.Sql.Query GlobalParts => new Core.Sql.Query(Database.GlobalParts.Connection.ConnectionString, Database.GlobalParts.Path.Query);
            public static Core.Sql.Query Basket => new Core.Sql.Query(Database.AutoPartsSite.Basket.Connection.ConnectionString, Database.AutoPartsSite.Basket.Path.Query);
            public static Core.Sql.Query Cms => new Core.Sql.Query(Database.AutoPartsSite.Cms.Connection.ConnectionString, Database.AutoPartsSite.Cms.Path.Query);
        }
    }
}
