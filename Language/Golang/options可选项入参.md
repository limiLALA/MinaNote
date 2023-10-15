代码示例
```go
// Options option
type Options struct {
	fileCacheDir string
}
type AssignOption func(*Options)

// NewOptions get 参数设置
func NewOptions(opts ...AssignOption) Options {
	var options Options
	for _, opt := range opts {
		opt(&options)
	}
	if options.fileCacheDir == "" {
		options.fileCacheDir = "."
	}
	return options
}

// WithFileCacheDir 设置fileCacheDir
func WithFileCacheDir(fileCacheDir string) AssignOption {
	return func(o *Options) {
		o.fileCacheDir = fileCacheDir
	}
}

// PrintFileCacheDir 使用可选项作为函数入参
func PrintFileCacheDir(opts ...AssignOption) map[string]interface{} {
	rainbowOpts := NewOptions(opts...)
	fmt.Print(rainbowOpts.fileCacheDir)
}

// 使用示例
func main() {
	// 使用默认的fileCacheDir
    PrintFileCacheDir(WithFileCacheDir())
    // 使用自定义的fileCacheDir
    PrintFileCacheDir(WithFileCacheDir("/test/cache"))
}
```