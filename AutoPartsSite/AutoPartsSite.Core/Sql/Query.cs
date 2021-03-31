using System;
using System.Data.SqlClient;

namespace AutoPartsSite.Core.Sql
{
    public class Query
    {
        private string connectionString;
        private string path;
        public Query(string connectionString, string path)
        {
            this.connectionString = connectionString;
            this.path = path;
        }

        public void Execute(string command, SqlParameter[] sqlParameters, Action<SqlDataReader> onExecute, Action<object[]> action)
        {
            if (action == null)
                return;

            string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

            this.ExecuteQuery(commandText, sqlParameters, onExecute, action);
        }

        public void ExecuteQuery(string commandText, SqlParameter[] sqlParameters, Action<SqlDataReader> onExecute, Action<object[]> action, int cmdTimeOut = 0)
        {
            if (string.IsNullOrEmpty(commandText))
                return;

            Helper.ExecuteQuery(connectionString, commandText, sqlParameters, onExecute, action, cmdTimeOut);
        }

        public void ExecuteNonQuery(string command, SqlParameter[] sqlParameters, int cmdTimeOut = 0)
        {

            string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

            if (string.IsNullOrEmpty(commandText))
                return;

            Helper.ExecuteNonQuery(connectionString, commandText, sqlParameters, cmdTimeOut);
        }
    }
}
