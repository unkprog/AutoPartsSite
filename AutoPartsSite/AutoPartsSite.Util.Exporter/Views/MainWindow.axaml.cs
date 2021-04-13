using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.Notifications;
using Avalonia.Markup.Xaml;
using System.Reflection;

namespace AutoPartsSite.Util.Exporter.Views
{
    public class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
             
        }
       
        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
#pragma warning disable CS8622 // ƒопустимость значений NULL дл€ ссылочных типов в типе параметра не соответствует целевому объекту делегировани€ (возможно, из-за атрибутов допустимости значений NULL).
            this.DataContextChanged += MainWindow_DataContextChanged;
#pragma warning restore CS8622 // ƒопустимость значений NULL дл€ ссылочных типов в типе параметра не соответствует целевому объекту делегировани€ (возможно, из-за атрибутов допустимости значений NULL).
            string version = this.GetType()!.Assembly!.GetCustomAttribute<AssemblyFileVersionAttribute>()!.Version;
            this.Title = "”тилита экспорта прайсов (верси€: " + version + ")";
        }

        private void MainWindow_DataContextChanged(object sender, System.EventArgs e)
        {
            if (this.DataContext == null)
                return;

            ((MainWindowViewModel)this.DataContext)._notificationManager = new WindowNotificationManager(this)
            {
                Position = NotificationPosition.TopRight,
                MaxItems = 3
            };
        }
    }
}
