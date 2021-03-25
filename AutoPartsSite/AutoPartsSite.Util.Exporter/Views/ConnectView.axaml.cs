using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace AutoPartsSite.Util.Exporter.Views
{
    public class ConnectView : UserControl
    {
        public ConnectView()
        {
            this.InitializeComponent();
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}
