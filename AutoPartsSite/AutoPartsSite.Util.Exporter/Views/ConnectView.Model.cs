using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using System;
using System.ComponentModel;
using System.Data.SqlClient;
using System.IO;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ConnectViewModel : MasterViewModel
    {
        public ConnectViewModel()
        {
            Load();
        }


        public void Load()
        {
            if (LicenseManager.UsageMode != LicenseUsageMode.Designtime)
            {
                try
                {
                    CheckDirectorySettings();
                    ConnectModel loadedSettings = Json.Read<ConnectModel>(GetFileNameSettings());
                    InitProperties(loadedSettings);
                }
                catch { }
            }
        }

        public void Save()
        {
            Json.Write(GetFileNameSettings(), this);
        }

        private string CheckDirectorySettings()
        {
            string result = pathSettings;
            if (!Directory.Exists(pathSettings))
                Directory.CreateDirectory(pathSettings);
            return result;
        }

        private string CheckDirectorySqlSettings()
        {
            CheckDirectorySettings();
            string result = pathSqlSettings;
            if (!Directory.Exists(pathSqlSettings))
                Directory.CreateDirectory(pathSqlSettings);
            return result;
        }

        private string GetFileNameSettings()
        {
            return string.Concat(CheckDirectorySettings(), fileSettings);
        }

        public override bool Validate()
        {
            bool result = base.Validate();
            string errorMessage = string.Empty;
            if (result)
            {
                if (connection != null)
                {
                    if (string.IsNullOrEmpty(connection.DataSource))
                        errorMessage = string.Concat(errorMessage, string.IsNullOrEmpty(errorMessage) ? string.Empty : Environment.NewLine, "Не указан сервер.");
                    if (!connection.IsSSPI)
                    {
                        if (string.IsNullOrEmpty(connection.UserID))
                            errorMessage = string.Concat(errorMessage, string.IsNullOrEmpty(errorMessage) ? string.Empty : Environment.NewLine, "Не указан пользователь.");
                    }
                    if (string.IsNullOrEmpty(connection.InitialCatalog))
                        errorMessage = string.Concat(errorMessage, string.IsNullOrEmpty(errorMessage) ? string.Empty : Environment.NewLine, "Не указана база данных.");
                }
                else
                    errorMessage = "Произошла непредвиденная ошибка - не задано подключение...";
            }
            if (!string.IsNullOrEmpty(errorMessage))
                MainWindowViewModel.This?.NotifyError(errorMessage);

            result = result && string.IsNullOrEmpty(errorMessage);

            if (result)
            {
                Save();
                MainWindowViewModel.This?.SetQuery(new Core.Sql.Query(buildConnectionString(), CheckDirectorySqlSettings()));
            }

            return result;
        }

        private string buildConnectionString()
        {
            SqlConnectionStringBuilder sqlConnectionStringBuilder = new SqlConnectionStringBuilder();
            sqlConnectionStringBuilder.DataSource = connection.DataSource;
            sqlConnectionStringBuilder.InitialCatalog = connection.InitialCatalog;
            if (connection.IsSSPI)
                sqlConnectionStringBuilder.IntegratedSecurity = true;
            else
            {
                sqlConnectionStringBuilder.UserID = connection.UserID;
                sqlConnectionStringBuilder.Password = connection.Password;
            }
            //sqlConnectionStringBuilder.ConnectTimeout = _ConnectTimeout;
            sqlConnectionStringBuilder.ApplicationName = "AutoPartsSite.Util.Exporter";

            return sqlConnectionStringBuilder.ToString();
        }
    }
}
