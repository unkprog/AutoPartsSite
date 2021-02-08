using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace AutoPartsSite.TestApp.Views
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
        }
    }
}
