﻿using System;
using System.Data.SqlClient;

namespace AutoPartSite.Core.Sql
{
    public class Query : Disposable
    {
        private string connectionString;
        private string path;
        public Query(string connectionString, string path)
        {
            this.connectionString = connectionString;
            this.path = path;
        }

        public void Execute(string command, SqlParameter[] sqlParameters, Action<object[]> action)
        {
            if (action == null)
                return;

            string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

            this.ExecuteQuery(commandText, sqlParameters, action);
        }

        public void ExecuteQuery(string commandText, SqlParameter[] sqlParameters, Action<object[]> action)
        {
            if (string.IsNullOrEmpty(commandText))
                return;

            Helper.ExecuteQuery(connectionString, commandText, sqlParameters, action);
        }

        public void ExecuteNonQuery(string command, SqlParameter[] sqlParameters)
        {

            string commandText = IO.Helper.ReadFileAsString(string.Concat(path, @"\", command, ".sql"));

            if (string.IsNullOrEmpty(commandText))
                return;

            Helper.ExecuteNonQuery(connectionString, commandText, sqlParameters);
        }
    }
}