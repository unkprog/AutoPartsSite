using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.Notifications;
using Avalonia.Markup.Xaml;

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
#pragma warning disable CS8622 // ������������ �������� NULL ��� ��������� ����� � ���� ��������� �� ������������� �������� ������� ������������� (��������, ��-�� ��������� ������������ �������� NULL).
            this.DataContextChanged += MainWindow_DataContextChanged;
#pragma warning restore CS8622 // ������������ �������� NULL ��� ��������� ����� � ���� ��������� �� ������������� �������� ������� ������������� (��������, ��-�� ��������� ������������ �������� NULL).
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
