﻿using AutoPartsSite.Util.Exporter.Models;
using ReactiveUI;
using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ConnectViewModel
    {
        internal static readonly string fileSettings = @"\connection.config";
        internal static readonly string pathSettings = string.Concat(Environment.CurrentDirectory, @"\Settings");
        internal static readonly string pathSqlSettings = string.Concat(Environment.CurrentDirectory, @"\Settings\Sql");

        public override string Header  => "Подключение"; 
        public override string Description => "Укажите настройки подключения с базе данных"; 
        

        internal void InitProperties(ConnectModel? connectSettings = null)
        {
            if (connectSettings != null)
                Connection = connectSettings;
        }

        private ConnectModel connection = new ConnectModel();

        [DataMember]
        public ConnectModel Connection
        {
            get => connection;
            set => this.RaiseAndSetIfChanged(ref connection, value);
        }
    }
}
