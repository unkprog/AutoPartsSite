using AutoPartsSite.Util.Exporter.ViewModels;
using Avalonia.Controls.Notifications;
using Avalonia.Threading;
using ReactiveUI;
using System;
using System.Reactive;
using System.Runtime.Serialization;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class MainWindowViewModel 
    {

        [IgnoreDataMember]
        public ReactiveCommand<Unit, Unit> PrevCommand => ReactiveCommand.Create(Prev);

        [IgnoreDataMember]
        public ReactiveCommand<Unit, Unit> NextCommand => ReactiveCommand.Create(Next);
    }

}
