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

        public Action<Exception> OnError;

        public void Execute(string command, SqlParameter[] sqlParameters, Action<SqlDataReader> onExecute, Action<object[]> action)
        {
            try
            {
                if (action == null)
                    return;

                string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

                this.ExecuteQuery(commandText, sqlParameters, onExecute, action);
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }
        }

        public void ExecuteQuery(string commandText, SqlParameter[] sqlParameters, Action<SqlDataReader> onExecute, Action<object[]> action, int cmdTimeOut = 0)
        {
            try
            {
                if (string.IsNullOrEmpty(commandText))
                    return;

                Helper.ExecuteQuery(connectionString, commandText, sqlParameters, onExecute, action, cmdTimeOut);
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }
        }

        public void ExecuteNonQuery(string command, SqlParameter[] sqlParameters, int cmdTimeOut = 0)
        {
            try
            {
                string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

                if (string.IsNullOrEmpty(commandText))
                    return;

                Helper.ExecuteNonQuery(connectionString, commandText, sqlParameters, cmdTimeOut);
            }
            catch (Exception ex)
            {
                OnError?.Invoke(ex);
            }

        }
    }
}
