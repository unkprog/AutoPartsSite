using System;
using System.Linq;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using AutoPartsSite.Models;

namespace AutoPartsSite.Core.Sql
{

    public static class Helper
    {
        public static void CreateCommand(string connectionString, string commandText, Action<SqlConnection, SqlCommand> action)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand(commandText, connection))
                {
                    if (connection.State != System.Data.ConnectionState.Open) connection.Open();
                    action?.Invoke(connection, command);
                }
            }
        }

        public static void AddParameters(this SqlCommand command, SqlParameter[] sqlParameters = null)
        {
            if (sqlParameters != null && sqlParameters.Length > 0)
                foreach (var p in sqlParameters)
                {
                    if (p.Value == null) p.Value = DBNull.Value;
                    Type t = p.Value.GetType();
                    if (t.IsArray)
                    {
                        if (p.Value is int[])
                            command.AddParameterArrayValues(p.ParameterName, (int[])p.Value);
                        else if (p.Value is string[])
                            command.AddParameterArrayValues(p.ParameterName, (string[])p.Value);
                        else if (p.Value is decimal[])
                            command.AddParameterArrayValues(p.ParameterName, (decimal[])p.Value);
                        else if (p.Value is DateTime[])
                            command.AddParameterArrayValues(p.ParameterName, (DateTime[])p.Value);
                        else
                            command.AddParameterArrayValues(p.ParameterName, (object[])p.Value);
                    }
                    else
                        command.Parameters.Add(p);
                }
        }

        public static void AddParameterArrayValues<T>(this SqlCommand command, string parameterName, T[] values)
        {
            List<string> parameterNames = new List<string>();

            for (int i = 0; values != null && i < values.Length; i++)
            {
                string paramName = parameterName + i;
                command.Parameters.AddWithValue(parameterName + i, values[i]);
                parameterNames.Add(paramName);
            }
            command.CommandText = command.CommandText.Replace(parameterName, string.Join(",", parameterNames));
        }

        public static void ExecuteNonQuery(string connectionString, string commandText, SqlParameter[] sqlParameters = null)
        {
            CreateCommand(connectionString, commandText,
                 (connection, command) =>
                 {
                     if (sqlParameters != null && sqlParameters.Length > 0)
                         command.AddParameters(sqlParameters);

                     command.ExecuteNonQuery();
                 }
            );
        }


        public static void ExecuteQuery(string connectionString, string commandText, SqlParameter[] sqlParameters, Action<object[]> action)
        {
            if (action == null)
                return;

            CreateCommand(connectionString, commandText,
                 (connection, command) =>
                 {
                     if (sqlParameters != null && sqlParameters.Length > 0)
                         command.AddParameters(sqlParameters);

                     using (SqlDataReader reader = command.ExecuteReader())
                     {
                         object[] values = new object[reader.FieldCount];
                         while (reader.Read())
                         {
                             reader.GetValues(values);
                             action(values);
                         }
                     }
                 }
            );
        }

        public static void LoadSqlScript(string file, Action<string> action)
        {
            if (!File.Exists(file))
                return;

            if (action == null)
                return;

            using (StreamReader reader = File.OpenText(file))
            {
                string line = string.Empty;
                StringBuilder script = new StringBuilder();

                Action<string> actionInoke = new Action<string>((sqlScript) =>
                {
                    if (!string.IsNullOrEmpty(sqlScript))
                        action(sqlScript);
                });

                while ((line = reader.ReadLine()) != null)
                {
                    if (string.Compare(line.Trim().ToLower(), "go") == 0)
                    {
                        actionInoke(script.ToString());
                        script.Clear();
                    }
                    else
                        script.AppendLine(line);
                }
                actionInoke(script.ToString());
            }
        }

        public static string MinReportDate() => Constants.minReportDate.ToString(Constants.dateFormat);

        public static bool IsExistsDate(string _date, out DateTime outdate)
        {
            outdate = Date(_date);
            return outdate > Constants.minReportDate;
        }

        public static DateTime Date(string _date, string formatDate = "")
        {
            DateTime result = Constants.minReportDate;
            if (!DateTime.TryParseExact(_date, string.IsNullOrEmpty(formatDate) ? Constants.dateFormat : formatDate, null, System.Globalization.DateTimeStyles.None, out result))
                result = Constants.minReportDate;
            return result;
        }

        public static DateTime DateReportEnd(string _date)
        {
            DateTime result = Constants.minReportDate;
            if (DateTime.TryParseExact(_date, Constants.dateFormat, null, System.Globalization.DateTimeStyles.None, out result) && result > Constants.minReportDate)
                result = result.AddDays(1);
            return result;
        }

        public static bool IsEmptyValue(this BaseDbModel value)
        {
            return (value == null || value.Id == 0);
        }

        public static int GetSqlParamValue(this BaseDbModel value)
        {
            return (value == null ? 0 : value.Id);
        }
    }
}
